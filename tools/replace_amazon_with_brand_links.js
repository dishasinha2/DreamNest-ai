const mysql = require("mysql2/promise");

const ikeaLinks = [
  "https://www.ikea.com/in/en/p/lack-coffee-table-white-20449902/",
  "https://www.ikea.com/in/en/p/malm-bed-frame-high-white-luroey-s39228262/",
  "https://www.ikea.com/in/en/p/besta-tv-unit-white-s595/",
  "https://www.ikea.com/in/en/p/micke-desk-white-80213074/",
  "https://www.ikea.com/in/en/p/knarrevik-bench-black-80423513/",
  "https://www.ikea.com/in/en/p/brogrund-mirror-with-shelf-10367891/"
];

const myntraLinks = [
  "https://www.myntra.com/home-decor",
  "https://www.myntra.com/furniture",
  "https://www.myntra.com/wall-art",
  "https://www.myntra.com/lamps-lighting",
  "https://www.myntra.com/rugs",
  "https://www.myntra.com/vases"
];

async function replaceAmazonLinks() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dishaa@261206",
    database: "dreamnestai"
  });

  console.log("Connected to DB...");

  // find amazon links
  const [rows] = await conn.execute(`
      SELECT id FROM furniture_recommendations 
      WHERE purchase_link LIKE '%amazon%'
  `);

  console.log("Found Amazon URLs:", rows.length);

  let index = 0;

  for (let row of rows) {
    let newLink;

    // alternate IKEA + Myntra
    if (index % 2 === 0) {
      newLink = ikeaLinks[index % ikeaLinks.length];
    } else {
      newLink = myntraLinks[index % myntraLinks.length];
    }

    await conn.execute(
      "UPDATE furniture_recommendations SET purchase_link=? WHERE id=?",
      [newLink, row.id]
    );

    console.log(`Updated ID ${row.id} → ${newLink}`);
    index++;
  }

  console.log("\n🎉 ALL AMAZON LINKS REPLACED WITH IKEA + MYNTRA LINKS!");

  await conn.end();
}

replaceAmazonLinks();
