import { pool } from '../database/pool.js';
import * as companyModel from '../models/company.model.js';
import * as userModel from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';

export async function createCompany(actor, { name, email }) {
  if (actor.role === 'admin') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const company = await companyModel.insertCompany(client, { name, email });
      await client.query('COMMIT');
      return company;
    } catch (err) {
      await client.query('ROLLBACK');
      if (err.code === '23505') {
        throw new AppError('Conflict creating company', 409, 'CONFLICT');
      }
      throw err;
    } finally {
      client.release();
    }
  }

  if (actor.role === 'company') {
    if (actor.companyId) {
      throw new AppError('Company profile already linked', 409, 'ALREADY_LINKED');
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const company = await companyModel.insertCompany(client, { name, email });
      const updated = await userModel.updateUserCompanyId(client, actor.id, company.id);
      await client.query('COMMIT');
      if (!updated) {
        throw new AppError('User not found', 404, 'NOT_FOUND');
      }
      return company;
    } catch (err) {
      await client.query('ROLLBACK');
      if (err.code === '23505') {
        throw new AppError('Conflict creating company', 409, 'CONFLICT');
      }
      throw err;
    } finally {
      client.release();
    }
  }

  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}
