import { pool } from '../database/pool.js';

export async function insertCompany(client, { name, email }) {
  const { rows } = await client.query(
    `INSERT INTO companies (name, email)
     VALUES ($1, $2)
     RETURNING id, name, email, created_at AS "createdAt"`,
    [name, email],
  );
  return rows[0];
}

export async function findCompanyById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email, created_at AS "createdAt" FROM companies WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}
