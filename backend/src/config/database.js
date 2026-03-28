import pg from 'pg';

import { env } from './index.js';
import { logger } from '../utils/logger.js';

export class DatabaseConnectionError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'DatabaseConnectionError';
    this.code = options.code;
    this.cause = options.cause;
  }
}

function publicMessageForPgError(err) {
  if (!err || typeof err !== 'object') {
    return 'Database error';
  }
  const code = err.code;
  if (code === 'ECONNREFUSED') {
    return 'Database server is unreachable (connection refused). Check host and port.';
  }
  if (code === 'ENOTFOUND') {
    return 'Database host could not be resolved.';
  }
  if (code === 'ETIMEDOUT') {
    return 'Database connection timed out.';
  }
  if (code === '28P01') {
    return 'Database authentication failed. Check credentials.';
  }
  if (code === '3D000') {
    return 'The requested database does not exist.';
  }
  if (code === '57P01' || code === '57P02' || code === '57P03') {
    return 'Database is not accepting connections.';
  }
  if (code === '42P07' || code === '42710') {
    return 'Database object already exists.';
  }
  return 'Database operation failed.';
}

function wrapErr(err) {
  const safe = new DatabaseConnectionError(publicMessageForPgError(err), {
    code: err?.code,
    cause: err,
  });
  return safe;
}

const connectionString = env.databaseUrl || process.env.DATABASE_URL || '';

export const pool = new pg.Pool({
  connectionString: connectionString || undefined,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', {
    message: publicMessageForPgError(err),
    code: err?.code,
  });
});

/**
 * Parameterized query helper (never interpolate SQL from user input here).
 */
export async function query(text, params = []) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    logger.error('Database query failed', {
      message: publicMessageForPgError(err),
      code: err?.code,
    });
    throw wrapErr(err);
  }
}

export async function verifyDatabaseConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1 AS ok');
  } catch (err) {
    logger.error('Database connectivity check failed', {
      message: publicMessageForPgError(err),
      code: err?.code,
    });
    throw wrapErr(err);
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
