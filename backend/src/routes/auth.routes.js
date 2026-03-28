import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import * as authController from '../controllers/auth.controller.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailQuerySchema,
} from '../validators/auth.validators.js';

const router = Router();

const registerLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new account
 *     description: Roles user, driver, or company. Driver requires licenseNumber; company requires companyName and companyEmail. Admin role is not allowed.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               email: { type: string, format: email, maxLength: 320 }
 *               password: { type: string, minLength: 10, maxLength: 128 }
 *               role: { type: string, enum: [user, driver, company], default: user }
 *               licenseNumber: { type: string, minLength: 3, maxLength: 64 }
 *               companyName: { type: string, minLength: 1, maxLength: 200 }
 *               companyEmail: { type: string, format: email, maxLength: 320 }
 *     responses:
 *       201:
 *         description: User created; returns tokens and public user
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       409:
 *         description: Email or unique constraint conflict
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post(
  '/register',
  registerLoginLimiter,
  sanitizeBody,
  validate(registerSchema, 'body'),
  authController.register,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, maxLength: 320 }
 *               password: { type: string, minLength: 1, maxLength: 128 }
 *     responses:
 *       200:
 *         description: Access and refresh tokens
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post(
  '/login',
  registerLoginLimiter,
  sanitizeBody,
  validate(loginSchema, 'body'),
  authController.login,
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Obtain new access token from refresh token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string, minLength: 10 }
 *     responses:
 *       200:
 *         description: New token pair
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post(
  '/refresh',
  sanitizeBody,
  validate(refreshSchema, 'body'),
  authController.refresh,
);

router.get(
  '/verify-email',
  verifyResetLimiter,
  validate(verifyEmailQuerySchema, 'query'),
  authController.verifyEmail,
);

router.post(
  '/forgot-password',
  verifyResetLimiter,
  sanitizeBody,
  validate(forgotPasswordSchema, 'body'),
  authController.forgotPassword,
);

router.post(
  '/reset-password',
  verifyResetLimiter,
  sanitizeBody,
  validate(resetPasswordSchema, 'body'),
  authController.resetPassword,
);

export default router;
