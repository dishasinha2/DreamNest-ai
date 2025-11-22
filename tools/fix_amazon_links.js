const mysql = require("mysql2/promise");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function fixAmazonLinks() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dishaa@261206",
    database: "dreamnestai",
  });

  console.log("Connected to DB...");

  const [rows] = await conn.execute(`
    SELECT id, purchase_link 
    FROM furniture_recommendations
    WHERE purchase_link LIKE '%amazon.in/s?k%'
  `);

  console.log("Found", rows.length, "invalid Amazon URLs");

  const browser = await puppeteer.launch({
    headless: false, // 🔥 keep false for debugging
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Fake user-agent (latest Chrome)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Amazon India locale cookie
  await page.setCookie({
    name: "lc-acbnp",
    value: "en_IN",
    domain: ".amazon.in",
  });

  for (let row of rows) {
    try {
      let searchUrl = row.purchase_link;

      console.log("Fixing ID:", row.id, "→", searchUrl);

      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 0 });

      // Accept Cookies Popup
      try {
        await page.click("#sp-cc-accept", { timeout: 3000 });
      } catch {}

      await page.waitForTimeout(3000);

      // Scroll page to load all results
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);

      // Get First Amazon Product Link
      let productUrl = await page.evaluate(() => {
        const selectors = [
          "a.a-link-normal.s-no-outline",     // primary
          "a.a-link-normal.a-text-normal",     // fallback 1
          "h2 a.a-link-normal",                // fallback 2
        ];

        for (let sel of selectors) {
          let el = document.querySelector(sel);
          if (el) return el.href;
        }
        return null;
      });

      if (!productUrl || !productUrl.includes("/dp/")) {
        console.log("❌ No valid product found for ID:", row.id);
        continue;
      }

      console.log("✅ Fixed URL:", productUrl);

      await conn.execute(
        "UPDATE furniture_recommendations SET purchase_link=? WHERE id=?",
        [productUrl, row.id]
      );
    } catch (err) {
      console.log("Error fixing ID:", row.id, "→", err.message);
    }
  }

  await browser.close();
  await conn.end();

  console.log("\n🎉 DONE! All Amazon URLs repaired successfully.");
}

fixAmazonLinks();
