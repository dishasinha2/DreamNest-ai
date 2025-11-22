/**
 * seed_all.js
 * Node.js seeder that inserts:
 * - 150 vendors
 * - 100 decor items
 * - 50 lighting items
 * - optionally writes SQL dump files
 *
 * Usage:
 * 1) npm i mysql2 dotenv
 * 2) create .env with DB_* variables
 * 3) node seed_all.js
 */

const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dreamnestai',
  port: Number(process.env.DB_PORT || 3306),
};

const cities = ['Delhi','Mumbai','Bangalore','Pune','Chennai','Hyderabad','Kolkata','Ahmedabad','Jaipur','Lucknow'];
const vendorServices = ['carpenter','electrician','painter','plumber','interior_designer','furniture_maker','mason','tiler'];
const styles = ['modern','traditional','luxury','minimal'];
const rooms = ['living_room','bedroom','dining_room','kitchen','bathroom'];

// helper to random pick
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const randBetween = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const phoneRandom = () => '9' + String(Math.floor(100000000 + Math.random()*900000000));

(async function seed() {
  const conn = await mysql.createConnection(DB);
  console.log('Connected to DB.');

  // 1) Vendors (150)
  const vendors = [];
  for (let i=1;i<=150;i++){
    const city = pick(cities);
    const svc = pick(vendorServices);
    const name = `${city} ${svc.split('_').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')} Co ${i}`;
    const rating = (Math.round((3.8 + Math.random()*1.4)*10)/10); // 3.8 - 5.2 -> will be truncated to 1 decimal
    const exp = randBetween(2,20);
    const phone = phoneRandom();
    vendors.push({name, service_type: svc, location: city, contact_number: phone, rating, experience_years: exp});
  }

  // create SQL dump string for vendors
  const vendorSqlHeader = `INSERT INTO vendors (name, service_type, location, contact_number, rating, experience_years) VALUES\n`;
  const vendorValues = vendors.map(v => `(${conn.escape(v.name)}, ${conn.escape(v.service_type)}, ${conn.escape(v.location)}, ${conn.escape(v.contact_number)}, ${v.rating}, ${v.experience_years})`).join(',\n') + ';';
  fs.writeFileSync('vendors_dump.sql', vendorSqlHeader + vendorValues);
  console.log('vendors_dump.sql written.');

  // insert vendors to DB in batches
  const vendorChunks = [];
  for (let i=0;i<vendors.length;i+=25) vendorChunks.push(vendors.slice(i,i+25));
  for (const chunk of vendorChunks){
    const vals = chunk.map(v => [v.name, v.service_type, v.location, v.contact_number, v.rating, v.experience_years]);
    await conn.query(
      'INSERT INTO vendors (name, service_type, location, contact_number, rating, experience_years) VALUES ?',
      [vals]
    );
  }
  console.log('Inserted 150 vendors.');

  // 2) Furniture (decor + lighting)
  const furniture = [];

  // Pre-made product name templates (these will produce varied titles)
  const decorTemplates = [
    'Handcrafted {X} Vase','Boho {X} Wall Art','Minimal {X} Plant Pot','Decorative {X} Rug','Ceramic {X} Sculpture',
    'Framed {X} Painting','Set of 3 {X} Canvas','Wooden {X} Photo Frame','Patterned {X} Cushion Cover Set','Wall Tapestry {X}'
  ];

  const lightingTemplates = [
    'Pendant Light {X}','LED Floor Lamp {X}','Vintage Wall Sconce {X}','Crystal Chandelier {X}','Minimal Table Lamp {X}',
    'Copper Finish Lantern {X}','Designer Ceiling Light {X}','Strip LED Under-Cabinet {X}','Industrial Lamp {X}','Smart Bulb Kit {X}'
  ];

  const decorObjects = ['Flora','Sunrise','Indigo','Mandala','Heritage','Rustic','Marble','Nordic','Zen','Coral','Bamboo','Moon','Aurora','Vintage','Olive'];

  // generate 100 decor items
  for (let i=0;i<100;i++){
    const room = pick(rooms);
    const t = decorTemplates[i % decorTemplates.length];
    const obj = pick(decorObjects);
    const name = t.replace('{X}', obj);
    const style = pick(styles);
    const type = 'decor';
    // set price by style
    const base = style === 'luxury' ? randBetween(2000,12000) : style === 'traditional' ? randBetween(800,5000) : style === 'modern' ? randBetween(700,6000) : randBetween(300,2000);
    const price = Number((Math.round(base*100)/100).toFixed(2));
    // small set of ecom links/images (some Amazon/Urban/Pepperfry/Ikea)
    const purchase_link = `https://www.amazon.in/s?k=${encodeURIComponent(name.split(' ').slice(0,3).join('+'))}`;
    const image_url = `https://dummyimage.com/600x400/ccc/000&text=${encodeURIComponent(name)}`;
    furniture.push({
      room_type: room,
      item_name: name,
      item_type: type,
      style,
      price_range: price,
      purchase_link,
      image_url
    });
  }

  // generate 50 lighting items
  for (let i=0;i<50;i++){
    const room = pick(rooms);
    const t = lightingTemplates[i % lightingTemplates.length];
    const obj = (i%2===0) ? 'Classic' : 'Neo';
    const name = `${t.replace('{X}', obj)} ${i+1}`;
    const style = pick(styles);
    const type = 'lighting';
    const base = style === 'luxury' ? randBetween(5000,19999) : style === 'traditional' ? randBetween(1500,8000) : style === 'modern' ? randBetween(800,7000) : randBetween(400,2500);
    const price = Number((Math.round(base*100)/100).toFixed(2));
    const purchase_link = `https://www.amazon.in/s?k=${encodeURIComponent(name.split(' ').slice(0,3).join('+'))}`;
    const image_url = `https://dummyimage.com/600x400/eee/000&text=${encodeURIComponent(name)}`;
    furniture.push({
      room_type: room,
      item_name: name,
      item_type: type,
      style,
      price_range: price,
      purchase_link,
      image_url
    });
  }

  // optionally generate a few furniture items to reach combined counts if you want:
  // (not necessary since earlier you already have 150 items, but script is safe to insert)
  // Now write furniture SQL dump file
  const furnitureSqlHeader = `INSERT INTO furniture_recommendations (room_type, item_name, item_type, style, price_range, purchase_link, image_url) VALUES\n`;
  const furnitureValues = furniture.map(f => `(${conn.escape(f.room_type)}, ${conn.escape(f.item_name)}, ${conn.escape(f.item_type)}, ${conn.escape(f.style)}, ${f.price_range}, ${conn.escape(f.purchase_link)}, ${conn.escape(f.image_url)})`).join(',\n') + ';';
  fs.writeFileSync('furniture_dump_partial.sql', furnitureSqlHeader + furnitureValues);
  console.log('furniture_dump_partial.sql written.');

  // insert furniture in chunks
  for (let i=0;i<furniture.length;i+=25){
    const chunk = furniture.slice(i,i+25);
    const vals = chunk.map(f => [f.room_type, f.item_name, f.item_type, f.style, f.price_range, f.purchase_link, f.image_url]);
    await conn.query(
      'INSERT INTO furniture_recommendations (room_type, item_name, item_type, style, price_range, purchase_link, image_url) VALUES ?',
      [vals]
    );
  }
  console.log(`Inserted ${furniture.length} furniture items (decor + lighting).`);

  await conn.end();
  console.log('Seeding complete. Files written: vendors_dump.sql, furniture_dump_partial.sql');
  process.exit(0);
})().catch(e => {
  console.error('Seeding failed', e);
  process.exit(1);
});
