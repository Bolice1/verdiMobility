import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';

import bcrypt from 'bcrypt';
import pg from 'pg';

import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_ADMIN_EMAIL = 'admin@verdi.com';
const BCRYPT_ROUNDS = Number.parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10);

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function applyTrackedMigrations(client) {
  const migDir = join(__dirname, '../../sql/migrations');
  const files = (await readdir(migDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const appliedResult = await client.query(
    `SELECT name FROM schema_migrations`,
  );
  const applied = new Set(appliedResult.rows.map((row) => row.name));

  for (const f of files) {
    if (applied.has(f)) {
      logger.info(`Skipping already applied migration ${f}`);
      continue;
    }

    const sql = await readFile(join(migDir, f), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (name) VALUES ($1)`,
        [f],
      );
      await client.query('COMMIT');
      logger.info(`Applied migration ${f}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }
}

function publicMessageForPgError(err) {
  if (!err || typeof err !== 'object') return 'Database error';
  const code = err.code;
  if (code === 'ECONNREFUSED') {
    return 'Database server is unreachable (connection refused).';
  }
  if (code === 'ENOTFOUND') {
    return 'Database host could not be resolved.';
  }
  if (code === '28P01') {
    return 'Database authentication failed.';
  }
  if (code === '3D000') {
    return 'Database does not exist.';
  }
  if (code === '42601' || code === '42703') {
    return 'SQL error while applying schema (invalid syntax or object).';
  }
  if (code === '42P07' || code === '42710') {
    return 'Schema already applied or conflicting object exists (use a fresh database or migrate manually).';
  }
  return 'Database operation failed.';
}

async function ensureDefaultAdmin(client) {
  const { rows } = await client.query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1',
    [DEFAULT_ADMIN_EMAIL],
  );
  if (rows.length > 0) {
    logger.info('Admin user already present; skipping seed');
    return;
  }
  const plain =
    process.env.ADMIN_SEED_PASSWORD || 'ChangeMe!VerdiAdmin2025';
  const passwordHash = await bcrypt.hash(plain, BCRYPT_ROUNDS);
  await client.query(
    `INSERT INTO users (name, email, password, role, email_verified)
     VALUES ($1, $2, $3, 'admin'::user_role, TRUE)`,
    ['Platform Admin', DEFAULT_ADMIN_EMAIL, passwordHash],
  );
  logger.info('Default admin user created', {
    email: DEFAULT_ADMIN_EMAIL,
    hint: process.env.ADMIN_SEED_PASSWORD
      ? undefined
      : 'Set ADMIN_SEED_PASSWORD in .env to choose password; change after first login.',
  });
}

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    logger.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sqlPath = join(__dirname, '../../sql/schema.sql');
  let sql;
  try {
    sql = await readFile(sqlPath, 'utf8');
  } catch (e) {
    logger.error('Failed to read schema file', { path: sqlPath, message: e.message });
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  try {
    logger.info('Connecting to PostgreSQL for schema apply');
    await client.connect();
    await ensureMigrationsTable(client);
    const { rows: regRows } = await client.query(
      `SELECT to_regclass('public.users') AS users_table`,
    );
    if (!regRows[0]?.users_table) {
      logger.info('Executing schema.sql');
      await client.query(sql);
      logger.info('Schema applied successfully');
    } else {
      logger.info('Base schema already present; skipping schema.sql');
    }

    try {
      await applyTrackedMigrations(client);
    } catch (e) {
      if (e.code === 'ENOENT') {
        logger.warn('sql/migrations directory not found');
      } else {
        logger.error('Migration failed', {
          message: publicMessageForPgError(e),
          code: e?.code,
        });
        process.exit(1);
      }
    }

    await ensureDefaultAdmin(client);
    try {
      const idxPath = join(__dirname, '../../sql/indexes_admin.sql');
      const idxSql = await readFile(idxPath, 'utf8');
      await client.query(idxSql);
      logger.info('Applied sql/indexes_admin.sql');
    } catch (e) {
      if (e.code === 'ENOENT') {
        logger.warn('indexes_admin.sql not found');
      } else {
        logger.warn('Optional admin indexes apply failed', {
          message: publicMessageForPgError(e),
          code: e?.code,
        });
      }
    }
    logger.info('Database schema task completed successfully');
  } catch (err) {
    logger.error('Database setup failed', {
      message: publicMessageForPgError(err),
      code: err?.code,
    });
    process.exit(1);
  } finally {
    await client.end().catch((e) =>
      logger.warn('Client end warning', { message: e.message }),
    );
  }
}

run();
