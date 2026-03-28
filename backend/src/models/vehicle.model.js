import { pool } from '../database/pool.js';

const VEHICLE_FIELDS = `v.id,
  v.company_id AS "companyId",
  v.driver_id AS "driverId",
  v.plate_number AS "plateNumber",
  v.capacity,
  v.status,
  v.current_latitude AS "currentLatitude",
  v.current_longitude AS "currentLongitude",
  v.current_location_label AS "currentLocationLabel",
  COALESCE(v.available_cargo_space, v.capacity) AS "availableCargoSpace",
  v.last_location_updated_at AS "lastLocationUpdatedAt"`;

export async function insertVehicle(
  client,
  {
    companyId,
    driverId,
    plateNumber,
    capacity,
    status,
    currentLatitude,
    currentLongitude,
    currentLocationLabel,
    availableCargoSpace,
  },
) {
  const { rows } = await client.query(
    `INSERT INTO vehicles (
       company_id,
       driver_id,
       plate_number,
       capacity,
       status,
       current_latitude,
       current_longitude,
       current_location_label,
       available_cargo_space,
       last_location_updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CASE WHEN $6 IS NULL OR $7 IS NULL THEN NULL ELSE NOW() END)
     RETURNING ${VEHICLE_FIELDS}`,
    [
      companyId,
      driverId ?? null,
      plateNumber,
      capacity,
      status,
      currentLatitude ?? null,
      currentLongitude ?? null,
      currentLocationLabel ?? null,
      availableCargoSpace ?? capacity,
    ],
  );
  return rows[0];
}

export async function findVehicleById(id) {
  const { rows } = await pool.query(
    `SELECT ${VEHICLE_FIELDS}
     FROM vehicles v WHERE v.id = $1`,
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
  if ('currentLatitude' in patch) {
    fields.push(`current_latitude = $${i++}`);
    values.push(patch.currentLatitude);
  }
  if ('currentLongitude' in patch) {
    fields.push(`current_longitude = $${i++}`);
    values.push(patch.currentLongitude);
  }
  if ('currentLocationLabel' in patch) {
    fields.push(`current_location_label = $${i++}`);
    values.push(patch.currentLocationLabel);
  }
  if ('availableCargoSpace' in patch) {
    fields.push(`available_cargo_space = $${i++}`);
    values.push(patch.availableCargoSpace);
  }
  if (
    'currentLatitude' in patch ||
    'currentLongitude' in patch ||
    'currentLocationLabel' in patch
  ) {
    fields.push(`last_location_updated_at = NOW()`);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const { rows } = await client.query(
    `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${i}
     RETURNING ${VEHICLE_FIELDS}`,
    values,
  );
  return rows[0] ?? null;
}

export async function listVehiclesForQuery({
  companyId,
  driverId,
  status,
  destination,
  minAvailableCapacity,
  limit,
  offset,
}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (companyId) {
    conditions.push(`v.company_id = $${idx++}`);
    values.push(companyId);
  }
  if (driverId) {
    conditions.push(`v.driver_id = $${idx++}`);
    values.push(driverId);
  }
  if (status) {
    conditions.push(`v.status = $${idx++}`);
    values.push(status);
  }
  if (minAvailableCapacity !== undefined) {
    conditions.push(`COALESCE(v.available_cargo_space, v.capacity) >= $${idx++}`);
    values.push(minAvailableCapacity);
  }
  if (destination) {
    conditions.push(`COALESCE(s.destination, '') ILIKE $${idx++}`);
    values.push(`%${destination}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS c
     FROM vehicles v
     LEFT JOIN LATERAL (
       SELECT destination
       FROM shipments
       WHERE vehicle_id = v.id AND status IN ('matched', 'in_transit')
       ORDER BY created_at DESC
       LIMIT 1
     ) s ON TRUE
     ${where}`,
    values,
  );
  const total = countResult.rows[0].c;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT
        ${VEHICLE_FIELDS},
        s.destination AS "activeDestination",
        s.pickup_location AS "activePickupLocation"
     FROM vehicles v
     LEFT JOIN LATERAL (
       SELECT pickup_location, destination
       FROM shipments
       WHERE vehicle_id = v.id AND status IN ('matched', 'in_transit')
       ORDER BY created_at DESC
       LIMIT 1
     ) s ON TRUE
     ${where}
     ORDER BY v.plate_number ASC
     LIMIT $${idx++} OFFSET $${idx}`,
    values,
  );
  return { rows, total };
}

export async function listCandidateVehiclesForMatching(client) {
  const { rows } = await client.query(
    `SELECT ${VEHICLE_FIELDS}
     FROM vehicles v
     WHERE v.status = 'available'`,
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

export async function listMarketplaceVehicles({ destination, minAvailableCapacity, limit, offset }) {
  const values = [];
  const conditions = [`v.status = 'available'`];
  let idx = 1;

  if (minAvailableCapacity !== undefined) {
    conditions.push(`COALESCE(v.available_cargo_space, v.capacity) >= $${idx++}`);
    values.push(minAvailableCapacity);
  }
  if (destination) {
    conditions.push(`COALESCE(s.destination, '') ILIKE $${idx++}`);
    values.push(`%${destination}%`);
  }

  const whereSql = `WHERE ${conditions.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS c
     FROM vehicles v
     LEFT JOIN LATERAL (
       SELECT destination
       FROM shipments
       WHERE vehicle_id = v.id AND status IN ('matched', 'in_transit')
       ORDER BY created_at DESC
       LIMIT 1
     ) s ON TRUE
     ${whereSql}`,
    values,
  );

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT
        ${VEHICLE_FIELDS},
        c.name AS "companyName",
        s.destination AS "activeDestination",
        s.pickup_location AS "activePickupLocation"
     FROM vehicles v
     INNER JOIN companies c ON c.id = v.company_id
     LEFT JOIN LATERAL (
       SELECT pickup_location, destination
       FROM shipments
       WHERE vehicle_id = v.id AND status IN ('matched', 'in_transit')
       ORDER BY created_at DESC
       LIMIT 1
     ) s ON TRUE
     ${whereSql}
     ORDER BY COALESCE(v.last_location_updated_at, NOW()) DESC, v.plate_number ASC
     LIMIT $${idx++} OFFSET $${idx}`,
    values,
  );

  return { rows, total: countResult.rows[0].c };
}
