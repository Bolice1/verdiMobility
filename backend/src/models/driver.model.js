import { pool } from '../database/pool.js';

export async function insertDriver(client, { userId, licenseNumber }) {
  const { rows } = await client.query(
    `INSERT INTO drivers (user_id, license_number)
     VALUES ($1, $2)
     RETURNING id, user_id AS "userId", license_number AS "licenseNumber", rating`,
    [userId, licenseNumber],
  );
  return rows[0];
}

export async function findDriverByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id AS "userId", license_number AS "licenseNumber", rating
     FROM drivers WHERE user_id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function findDriverById(id) {
  const { rows } = await pool.query(
    `SELECT id, user_id AS "userId", license_number AS "licenseNumber", rating
     FROM drivers WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

<<<<<<< HEAD
export async function findDriverWithUserById(id) {
  const { rows } = await pool.query(
    `SELECT d.license_number AS "licenseNumber", u.name, u.email
     FROM drivers d
     INNER JOIN users u ON u.id = d.user_id
     WHERE d.id = $1`,
    [id],
=======
export async function updateDriverRating(client, driverId, rating) {
  const { rows } = await client.query(
    `UPDATE drivers SET rating = $2 WHERE id = $1
     RETURNING id, user_id AS "userId", license_number AS "licenseNumber", rating`,
    [driverId, rating],
>>>>>>> 9cecc71706a9a6f1e8b13f70072761e73714b871
  );
  return rows[0] ?? null;
}
