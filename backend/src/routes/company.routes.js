import { Router } from 'express';

import * as companyController from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import { createCompanySchema } from '../validators/company.validators.js';

const router = Router();

/**
 * @openapi
 * /companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a company (admin or company user without linked company)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               email: { type: string, format: email, maxLength: 320 }
 *     responses:
 *       201:
 *         description: Company created
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post(
  '/',
  authenticate,
  sanitizeBody,
  validate(createCompanySchema, 'body'),
  companyController.create,
);

export default router;
