
// Cleanup script to drop conflicting tables/enums before re-running migrations
require('dotenv').config({ path: 'server/.env' });
const { Client } = require('pg');

(async () => {
  const c = new Client({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
  });
  
  await c.connect();
  const dbname = (await c.query('select current_database() as d')).rows[0].d;
  console.log('Cleaning DB:', dbname);
  
  await c.query('DROP TABLE IF EXISTS student_parents, students, parents, teachers, users, "__drizzle_migrations" CASCADE;');
  await c.query('DROP TYPE IF EXISTS "role" CASCADE;');
  await c.query('DROP TYPE IF EXISTS "gender" CASCADE;');
  
  console.log('Cleanup OK');
  await c.end();
})().catch(e => { 
  console.error(e); 
  process.exit(1); 
});
