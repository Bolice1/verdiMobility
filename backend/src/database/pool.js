import pg from 'pg';

import { env } from '../config/index.js';

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console -- logger may not be ready
  console.error('Unexpected PG pool error', err);
});
