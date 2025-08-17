import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',            // <-- Migrationen in server/drizzle
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
