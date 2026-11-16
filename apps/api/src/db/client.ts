import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = NodePgDatabase<typeof schema>;
export const DB = Symbol('DB');
export const POOL = Symbol('POOL');

export function createPool(url: string): Pool {
  return new Pool({ connectionString: url, max: 10 });
}

export function createDb(pool: Pool): Db {
  return drizzle(pool, { schema });
}
