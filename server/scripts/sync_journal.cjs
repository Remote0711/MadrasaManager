require('dotenv').config({path:'server/.env'});
const { Client } = require('pg');

(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();

  await c.query('CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (id integer primary key, hash text not null, created_at bigint not null)');
  await c.query('INSERT INTO "__drizzle_migrations"(id,hash,created_at) VALUES (0,$1,$2) ON CONFLICT (id) DO NOTHING', ['0000_yummy_master_mold', Date.now()]);
  await c.query('INSERT INTO "__drizzle_migrations"(id,hash,created_at) VALUES (1,$1,$2) ON CONFLICT (id) DO NOTHING', ['0001_careful_thundra', Date.now()]);

  console.log('migrations table synced');
  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
