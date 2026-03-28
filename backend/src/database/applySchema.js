/**
 * Applies sql/schema.sql using DATABASE_URL from environment.
 * Usage: npm run db:schema
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';

import pg from 'pg';

import { assertRequiredEnv } from '../config/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  assertRequiredEnv();
  const sqlPath = join(__dirname, '../../sql/schema.sql');
  const sql = await readFile(sqlPath, 'utf8');
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(sql);
    // eslint-disable-next-line no-console
    console.log('Schema applied successfully.');
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
