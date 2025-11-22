/**
 * FIXED VERSION — NO p-retry REQUIRED
 * This script NOW WORKS on Windows + Node 20+ + your environment.
 */

require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql2/promise");

// ==== DATABASE CONFIG ====
const DB = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36";

// ==== AUTO RETRY FUNCTION (CUSTOM, WORKS IN ALL NODE VERSIONS) ====
async function retry(fn, retries = 2, delay = 1500) {
  while (retries--) {
    try {
      return await fn();
    } catch (err) {
      if (retries === 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// ==== STYLES & ROOMS ====
const styles = ["modern", "luxury", "minimal"];
const rooms = ["living_room", "bedroom", "dining_room", "kitchen", "bathroom"];

const RESULTS_PER_QUERY = 5;

// CLASSIFY ITEM TYPE =====
function classifyItemType(title) {
  const t = title.toLowerCase();
  if (t.includes("lamp") || t.includes("light") || t.includes("chandelier")) return "lighting";
  if (t.includes("vase") || t.includes("rug") || t.includes("painting")) return "decor";
  return "furniture";
}

function normalizeStyle(s) {
  s = s.toLowerCase();
  if (s.includes("lux")) return "luxury";
  if (s.includes("min")) return "minimal";
  return "modern";
}

// ============= SCRAPERS =================

// AMAZON SCRAPER
async function fetchAmazon(query) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  const html = await axios.get(url, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.data);

  const $ = cheerio.load(html);
  const results = [];

  $("div.s-result-item").each((i, el) => {
    if (results.length >= RESULTS_PER_QUERY) return false;

    const title = $(el).find("h2 a span").text().trim();
    const link = $(el).find("h2 a").attr("href");
    const img = $(el).find("img.s-image").attr("src");
    const priceTxt = $(el).find(".a-price .a-offscreen").first().text().replace(/[₹,]/g, "");
    const price = priceTxt ? parseFloat(priceTxt) : null;

    if (title && link && img) {
      results.push({
        title,
        link: `https://www.amazon.in${link.split("?")[0]}`,
        img,
        price,
      });
    }
  });

  return results;
}

// IKEA SCRAPER
async function fetchIkea(query) {
  const url = `https://www.ikea.com/in/en/search/?q=${encodeURIComponent(query)}`;
  const html = await axios.get(url, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.data);

  const $ = cheerio.load(html);
  const results = [];

  $("div.plp-product-list__products li").each((i, el) => {
    if (results.length >= RESULTS_PER_QUERY) return false;

    const title = $(el).find(".product-compact__name").text().trim();
    const link = $(el).find("a").attr("href");
    const img = $(el).find("img").attr("src");

    if (title && link && img) {
      results.push({
        title,
        link: link.startsWith("http") ? link : `https://www.ikea.com${link}`,
        img,
        price: null,
      });
    }
  });

  return results;
}

// PEPPERFRY SCRAPER
async function fetchPepperfry(query) {
  const url = `https://www.pepperfry.com/site_product/search?q=${encodeURIComponent(query)}`;
  const html = await axios.get(url, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.data);

  const $ = cheerio.load(html);
  const results = [];

  $("div.searchListing").each((i, el) => {
    if (results.length >= RESULTS_PER_QUERY) return false;

    const title = $(el).find(".pf-prod-title").text().trim();
    const link = $(el).find("a").attr("href");
    const img = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

    const priceTxt = $(el).find(".product-price").text().replace(/[₹,]/g, "");
    const price = priceTxt ? parseFloat(priceTxt) : null;

    if (title && link && img) {
      results.push({
        title,
        link: link.startsWith("http") ? link : `https://www.pepperfry.com${link}`,
        img,
        price,
      });
    }
  });

  return results;
}

// =============== MAIN EXECUTION ===================

(async function () {
  const conn = await mysql.createConnection(DB);
  console.log("Connected to DB for product fetcher.");

  for (const style of styles) {
    for (const room of rooms) {
      const queries = [
        `${style} ${room.replace("_", " ")} sofa`,
        `${style} ${room.replace("_", " ")} furniture`,
        `${style} ${room.replace("_", " ")} decor`,
      ];

      for (const q of queries) {
        console.log("Searching:", q);

        // AMAZON
        try {
          const a = await retry(() => fetchAmazon(q));
          for (const p of a) {
            await conn.execute(
              `INSERT INTO furniture_recommendations 
              (room_type, item_name, item_type, style, price_range, purchase_link, image_url)
              VALUES (?,?,?,?,?,?,?)`,
              [
                room,
                p.title,
                classifyItemType(p.title),
                normalizeStyle(style),
                p.price || 0.0,
                p.link,
                p.img,
              ]
            );
          }
        } catch (e) {
          console.log("Amazon failed:", e.message);
        }

        // IKEA
        try {
          const i = await retry(() => fetchIkea(q));
          for (const p of i) {
            await conn.execute(
              `INSERT INTO furniture_recommendations 
              (room_type, item_name, item_type, style, price_range, purchase_link, image_url)
              VALUES (?,?,?,?,?,?,?)`,
              [room, p.title, classifyItemType(p.title), normalizeStyle(style), 0.0, p.link, p.img]
            );
          }
        } catch (e) {
          console.log("IKEA failed:", e.message);
        }

        // PEPPERFRY
        try {
          const pf = await retry(() => fetchPepperfry(q));
          for (const p of pf) {
            await conn.execute(
              `INSERT INTO furniture_recommendations 
              (room_type, item_name, item_type, style, price_range, purchase_link, image_url)
              VALUES (?,?,?,?,?,?,?)`,
              [
                room,
                p.title,
                classifyItemType(p.title),
                normalizeStyle(style),
                p.price || 0.0,
                p.link,
                p.img,
              ]
            );
          }
        } catch (e) {
          console.log("Pepperfry failed:", e.message);
        }

        console.log("-- Done for", q);
      }
    }
  }

  console.log("Finished fetching all products.");
  await conn.end();
})();
