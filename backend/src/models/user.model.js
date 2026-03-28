import { pool } from '../database/pool.js';

const USER_PUBLIC_FIELDS = `id, name, email, role, company_id AS "companyId", created_at AS "createdAt",
  email_verified AS "emailVerified", suspended, suspended_reason AS "suspendedReason"`;

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS}, password
     FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS}
     FROM users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function findUserByVerificationTokenHash(tokenHash) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS}
     FROM users WHERE email_verification_token = $1 LIMIT 1`,
    [tokenHash],
  );
  return rows[0] ?? null;
}

export async function findUserByPasswordResetHash(tokenHash) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS}, password_reset_expires_at AS "passwordResetExpiresAt"
     FROM users WHERE password_reset_token_hash = $1 LIMIT 1`,
    [tokenHash],
  );
  return rows[0] ?? null;
}

export async function insertUser(
  client,
  {
    name,
    email,
    passwordHash,
    role,
    companyId,
    emailVerificationTokenHash,
    emailVerified = false,
  },
) {
  const { rows } = await client.query(
    `INSERT INTO users (name, email, password, role, company_id, email_verification_token, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${USER_PUBLIC_FIELDS}`,
    [
      name,
      email,
      passwordHash,
      role,
      companyId ?? null,
      emailVerificationTokenHash ?? null,
      emailVerified,
    ],
  );
  return rows[0];
}

export async function updateUserCompanyId(client, userId, companyId) {
  const { rows } = await client.query(
    `UPDATE users SET company_id = $2 WHERE id = $1
     RETURNING ${USER_PUBLIC_FIELDS}`,
    [userId, companyId],
  );
  return rows[0] ?? null;
}

export async function verifyUserEmail(client, userId) {
  const { rows } = await client.query(
    `UPDATE users SET email_verified = TRUE, email_verification_token = NULL
     WHERE id = $1
     RETURNING ${USER_PUBLIC_FIELDS}`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function setPasswordResetToken(client, userId, tokenHash, expiresAt) {
  await client.query(
    `UPDATE users SET password_reset_token_hash = $2, password_reset_expires_at = $3 WHERE id = $1`,
    [userId, tokenHash, expiresAt],
  );
}

export async function updatePasswordClearReset(client, userId, passwordHash) {
  const { rows } = await client.query(
    `UPDATE users
     SET password = $2,
         password_reset_token_hash = NULL,
         password_reset_expires_at = NULL
     WHERE id = $1
     RETURNING ${USER_PUBLIC_FIELDS}`,
    [userId, passwordHash],
  );
  return rows[0] ?? null;
}

export async function updateUserRoleAndFlags(
  client,
  userId,
  { role, suspended, suspendedReason },
) {
  const updates = [];
  const vals = [];
  let i = 1;
  if (role !== undefined) {
    updates.push(`role = $${i++}::user_role`);
    vals.push(role);
  }
  if (suspended !== undefined) {
    updates.push(`suspended = $${i++}`);
    vals.push(suspended);
  }
  if (suspendedReason !== undefined) {
    updates.push(`suspended_reason = $${i++}`);
    vals.push(suspendedReason);
  }
  if (updates.length === 0) return null;
  vals.push(userId);
  const { rows } = await client.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${i}
     RETURNING ${USER_PUBLIC_FIELDS}`,
    vals,
  );
  return rows[0] ?? null;
}

export async function countUsers() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM users`);
  return rows[0].c;
}

export async function listUsers({ limit, offset }) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS}
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return rows;
}

export async function findUserEmailAndNameById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}
