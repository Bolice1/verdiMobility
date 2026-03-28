import bcrypt from 'bcrypt';

import { env } from '../config/index.js';
import { pool } from '../database/pool.js';
import * as driverModel from '../models/driver.model.js';
import * as companyModel from '../models/company.model.js';
import * as userModel from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    companyId: row.companyId ?? null,
    createdAt: row.createdAt,
  };
}

function buildTokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    companyId: user.companyId ?? undefined,
  };
}

export async function register(input) {
  const existing = await userModel.findUserByEmail(input.email);
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (input.role === 'company') {
      const company = await companyModel.insertCompany(client, {
        name: input.companyName,
        email: input.companyEmail,
      });
      const user = await userModel.insertUser(client, {
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'company',
        companyId: company.id,
      });
      await client.query('COMMIT');
      const tokens = issueTokens(user);
      return { user: toPublicUser(user), ...tokens };
    }

    const user = await userModel.insertUser(client, {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      companyId: null,
    });

    if (input.role === 'driver') {
      await driverModel.insertDriver(client, {
        userId: user.id,
        licenseNumber: input.licenseNumber,
      });
    }

    await client.query('COMMIT');
    const tokens = issueTokens(user);
    return { user: toPublicUser(user), ...tokens };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      throw new AppError('Duplicate value violates unique constraint', 409, 'CONFLICT');
    }
    throw err;
  } finally {
    client.release();
  }
}

function issueTokens(userRow) {
  const payload = buildTokenPayload(userRow);
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: userRow.id }),
  };
}

export async function login({ email, password }) {
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }
  const publicUser = toPublicUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    createdAt: user.createdAt,
  });
  const tokens = issueTokens({
    id: user.id,
    role: user.role,
    companyId: user.companyId,
  });
  return { user: publicUser, ...tokens };
}

export async function refresh(refreshToken) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH');
  }
  const userId = decoded.sub;
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 401, 'USER_NOT_FOUND');
  }
  const payload = buildTokenPayload(user);
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}
