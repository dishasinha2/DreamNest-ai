/**
 * cloudinary_upload.js
 * - Uploads each furniture_recommendations.image_url to Cloudinary (if not already cloudinary)
 * - Updates the DB row with new cloudinary url
 *
 * Requirements:
 * npm i cloudinary axios mysql2 dotenv
 * .env must contain CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

const mysql = require('mysql2/promise');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dreamnestai'
};

(async function() {
  const conn = await mysql.createConnection(DB);
  console.log('Connected to DB.');

  // fetch records with non-cloudinary images (simple heuristic)
  const [rows] = await conn.execute("SELECT id, image_url FROM furniture_recommendations WHERE image_url IS NOT NULL");
  console.log(`${rows.length} items found.`);

  for (const r of rows) {
    const url = r.image_url;
    if (!url || url.includes('res.cloudinary.com')) continue;
    try {
      console.log('Uploading', url);
      // upload by remote url
      const resp = await cloudinary.uploader.upload(url, {
        folder: 'dreamnestai/furniture',
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });
      if (resp && resp.secure_url) {
        await conn.execute('UPDATE furniture_recommendations SET image_url = ? WHERE id = ?', [resp.secure_url, r.id]);
        console.log('Updated ID', r.id);
      }
    } catch (err) {
      console.error('Upload failed for', url, err.message);
    }
  }

  await conn.end();
  console.log('Cloudinary sync complete.');
})();
