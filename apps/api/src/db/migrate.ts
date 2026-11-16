import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { loadDotEnv } from '../env';
import { createDb, createPool } from './client';

export async function runMigrations(url: string): Promise<void> {
  const pool = createPool(url);
  try {
    await migrate(createDb(pool), { migrationsFolder: path.join(__dirname, '..', '..', 'drizzle') });
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  loadDotEnv();
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');
  runMigrations(url)
    .then(() => console.log('Migrations applied'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
