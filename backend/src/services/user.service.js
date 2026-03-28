import * as userModel from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';

export async function getProfile(userId) {
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId ?? null,
    createdAt: user.createdAt,
  };
}

export async function listUsersPaginated({ limit, offset }) {
  const [total, rows] = await Promise.all([
    userModel.countUsers(),
    userModel.listUsers({ limit, offset }),
  ]);
  return {
    data: rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      companyId: u.companyId ?? null,
      createdAt: u.createdAt,
    })),
    meta: paginationMeta({ total, limit, offset }),
  };
}
