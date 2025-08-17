require('dotenv').config({path:'server/.env'});
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
  await c.connect();
  await c.query('ALTER TABLE IF NOT EXISTS classes ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now() NOT NULL;');
  console.log('classes.created_at ensured');
  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
