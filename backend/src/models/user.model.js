import { pool } from '../database/pool.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password, role, company_id AS "companyId", created_at AS "createdAt"
     FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, company_id AS "companyId", created_at AS "createdAt"
     FROM users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function insertUser(
  client,
  { name, email, passwordHash, role, companyId },
) {
  const { rows } = await client.query(
    `INSERT INTO users (name, email, password, role, company_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, company_id AS "companyId", created_at AS "createdAt"`,
    [name, email, passwordHash, role, companyId ?? null],
  );
  return rows[0];
}

export async function updateUserCompanyId(client, userId, companyId) {
  const { rows } = await client.query(
    `UPDATE users SET company_id = $2 WHERE id = $1
     RETURNING id, name, email, role, company_id AS "companyId", created_at AS "createdAt"`,
    [userId, companyId],
  );
  return rows[0] ?? null;
}

export async function countUsers() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM users`);
  return rows[0].c;
}

export async function listUsers({ limit, offset }) {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, company_id AS "companyId", created_at AS "createdAt"
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return rows;
}
