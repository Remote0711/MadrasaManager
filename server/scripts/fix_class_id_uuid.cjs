require('dotenv').config({path:'server/.env'});
const { Client } = require('pg');

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
  await c.connect();

  // Typ vorher zeigen
  let r = await c.query("select data_type from information_schema.columns where table_name='students' and column_name='class_id'");
  console.log('students.class_id BEFORE:', r.rows[0]?.data_type);

  // Nullable machen (falls noch NOT NULL)
  await c.query("ALTER TABLE students ALTER COLUMN class_id DROP NOT NULL;");

  // Typwechsel auf uuid (bestehende Werte bleiben NULL, was ok ist)
  await c.query("ALTER TABLE students ALTER COLUMN class_id TYPE uuid USING NULLIF(class_id::text,'')::uuid;");

  // FK neu setzen -> classes(id)
  await c.query("DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='students' AND constraint_type='FOREIGN KEY' AND constraint_name='students_class_id_fkey') THEN ALTER TABLE students DROP CONSTRAINT students_class_id_fkey; END IF; END $$;");
  await c.query("ALTER TABLE students ADD CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;");

  // Typ nachher zeigen
  r = await c.query("select data_type from information_schema.columns where table_name='students' and column_name='class_id'");
  console.log('students.class_id AFTER :', r.rows[0]?.data_type);

  await c.end();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
