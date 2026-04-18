import { pool } from '../database/pool.js';

export async function insertVehicle(
  client,
  { companyId, driverId, plateNumber, capacity, status },
) {
  const { rows } = await client.query(
    `INSERT INTO vehicles (company_id, driver_id, plate_number, capacity, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, company_id AS "companyId", driver_id AS "driverId", plate_number AS "plateNumber",
               capacity, status`,
    [companyId, driverId ?? null, plateNumber, capacity, status],
  );
  return rows[0];
}

export async function findVehicleById(id) {
  const { rows } = await pool.query(
    `SELECT id, company_id AS "companyId", driver_id AS "driverId", plate_number AS "plateNumber",
            capacity, status
     FROM vehicles WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function updateVehicle(client, id, patch) {
  const fields = [];
  const values = [];
  let i = 1;

  if ('driverId' in patch) {
    fields.push(`driver_id = $${i++}`);
    values.push(patch.driverId);
  }
  if ('plateNumber' in patch) {
    fields.push(`plate_number = $${i++}`);
    values.push(patch.plateNumber);
  }
  if ('capacity' in patch) {
    fields.push(`capacity = $${i++}`);
    values.push(patch.capacity);
  }
  if ('status' in patch) {
    fields.push(`status = $${i++}`);
    values.push(patch.status);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const { rows } = await client.query(
    `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${i}
     RETURNING id, company_id AS "companyId", driver_id AS "driverId", plate_number AS "plateNumber",
               capacity, status`,
    values,
  );
  return rows[0] ?? null;
}

export async function listVehiclesForQuery({ companyId, driverId, status, limit, offset }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (companyId) {
    conditions.push(`company_id = $${idx++}`);
    values.push(companyId);
  }
  if (driverId) {
    conditions.push(`driver_id = $${idx++}`);
    values.push(driverId);
  }
  if (status) {
    conditions.push(`status = $${idx++}`);
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS c FROM vehicles ${where}`,
    values,
  );
  const total = countResult.rows[0].c;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT id, company_id AS "companyId", driver_id AS "driverId", plate_number AS "plateNumber",
            capacity, status
     FROM vehicles
     ${where}
     ORDER BY plate_number ASC
     LIMIT $${idx++} OFFSET $${idx}`,
    values,
  );
  return { rows, total };
}

export async function listCandidateVehiclesForMatching(client) {
  const { rows } = await client.query(
    `SELECT id, company_id AS "companyId", driver_id AS "driverId", plate_number AS "plateNumber",
            capacity, status
     FROM vehicles
     WHERE status = 'available'`,
  );
  return rows;
}

export async function listPastDestinationsForVehicle(client, vehicleId) {
  const { rows } = await client.query(
    `SELECT destination
     FROM shipments
     WHERE vehicle_id = $1 AND status IN ('delivered', 'in_transit', 'matched')
     ORDER BY created_at DESC
     LIMIT 20`,
    [vehicleId],
  );
  return rows.map((r) => r.destination);
}
