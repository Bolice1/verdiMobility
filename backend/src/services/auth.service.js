import bcrypt from 'bcrypt';

import { env } from '../config/index.js';
import { pool } from '../database/pool.js';
import * as driverModel from '../models/driver.model.js';
import * as companyModel from '../models/company.model.js';
import * as userModel from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { generateRawToken, hashToken } from '../utils/cryptoToken.js';
import { ForbiddenError, ValidationError } from '../utils/errors.js';
import { validateEmailSentinel } from '../utils/emailSentinel.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import * as emailService from './email.service.js';

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    companyId: row.companyId ?? null,
    emailVerified: Boolean(row.emailVerified),
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

async function assertEmailAllowed(email) {
  const sentinel = await validateEmailSentinel(email);
  if (!sentinel.valid) {
    throw new ValidationError(sentinel.errors.join(' '), 'EMAIL_VALIDATION');
  }
}

export async function register(input) {
  await assertEmailAllowed(input.email);
  if (input.role === 'company' && input.companyEmail) {
    await assertEmailAllowed(input.companyEmail);
  }

  const existing = await userModel.findUserByEmail(input.email);
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_IN_USE');
  }

  const rawVerifyToken = generateRawToken(32);
  const verifyHash = hashToken(rawVerifyToken);

  const passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let user;
    if (input.role === 'company') {
      const company = await companyModel.insertCompany(client, {
        name: input.companyName,
        email: input.companyEmail,
      });
      user = await userModel.insertUser(client, {
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'company',
        companyId: company.id,
        emailVerificationTokenHash: verifyHash,
        emailVerified: false,
      });
    } else {
      user = await userModel.insertUser(client, {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        companyId: null,
        emailVerificationTokenHash: verifyHash,
        emailVerified: false,
      });
      if (input.role === 'driver') {
        await driverModel.insertDriver(client, {
          userId: user.id,
          licenseNumber: input.licenseNumber,
        });
      }
    }

    await client.query('COMMIT');

    const verificationUrl = `${env.appUrl}/api/auth/verify-email?token=${encodeURIComponent(rawVerifyToken)}`;
    emailService.queueWelcomeEmail({ to: input.email, name: input.name });
    emailService.queueEmailVerification({
      to: input.email,
      name: input.name,
      verificationUrl,
    });
    if (env.adminAlertEmail) {
      emailService.queueAdminNewUserAlert({
        to: env.adminAlertEmail,
        newUser: { name: input.name, email: input.email, role: input.role },
      });
    }

    const tokens = issueTokens(user);
    return { user: toPublicUser(user), ...tokens };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      throw new AppError('Duplicate value violates unique constraint', 409, 'CONFLICT');
    }
    if (err.code === '42703') {
      throw new AppError(
        'Database schema out of date. Run npm run db:schema.',
        500,
        'SCHEMA_MISMATCH',
      );
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
  if (user.suspended) {
    throw new ForbiddenError('Account suspended', 'ACCOUNT_SUSPENDED');
  }
  if (env.requireEmailVerification && !user.emailVerified) {
    throw new ForbiddenError(
      'Email not verified. Check your inbox.',
      'EMAIL_NOT_VERIFIED',
    );
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
    emailVerified: user.emailVerified,
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
  if (user.suspended) {
    throw new ForbiddenError('Account suspended', 'ACCOUNT_SUSPENDED');
  }
  const payload = buildTokenPayload(user);
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}

export async function verifyEmailFromToken(rawToken) {
  if (!rawToken || String(rawToken).length < 10) {
    throw new ValidationError('Invalid token', 'INVALID_TOKEN');
  }
  const tokenHash = hashToken(rawToken);
  const user = await userModel.findUserByVerificationTokenHash(tokenHash);
  if (!user) {
    throw new AppError('Invalid or expired verification link', 400, 'INVALID_VERIFICATION');
  }
  const client = await pool.connect();
  try {
    await userModel.verifyUserEmail(client, user.id);
  } finally {
    client.release();
  }
  return { message: 'Email verified.', email: user.email };
}

export async function requestPasswordReset({ email }) {
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    return { message: 'If an account exists, instructions were sent.' };
  }
  const raw = generateRawToken(32);
  const tokenHash = hashToken(raw);
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const client = await pool.connect();
  try {
    await userModel.setPasswordResetToken(client, user.id, tokenHash, expires);
  } finally {
    client.release();
  }
  const resetUrl = `${env.appUrl}/api/auth/reset-password?token=${encodeURIComponent(raw)}`;
  emailService.queuePasswordResetEmail({
    to: user.email,
    name: user.name,
    resetUrl,
  });
  return { message: 'If an account exists, instructions were sent.' };
}

export async function resetPasswordWithToken({ token, password }) {
  const tokenHash = hashToken(token);
  const user = await userModel.findUserByPasswordResetHash(tokenHash);
  if (!user) {
    throw new AppError('Invalid or expired reset link', 400, 'INVALID_RESET_TOKEN');
  }
  const exp = user.passwordResetExpiresAt
    ? new Date(user.passwordResetExpiresAt).getTime()
    : 0;
  if (Date.now() > exp) {
    throw new AppError('Reset link expired', 400, 'RESET_EXPIRED');
  }
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const client = await pool.connect();
  try {
    await userModel.updatePasswordClearReset(client, user.id, passwordHash);
  } finally {
    client.release();
  }
  emailService.queuePasswordChangedEmail({ to: user.email, name: user.name });
  return { message: 'Password updated. You can sign in.' };
}
