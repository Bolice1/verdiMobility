import { Router } from 'express';

import * as matchingController from '../controllers/matching.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import { runMatchingSchema } from '../validators/matching.validators.js';

const router = Router();

/**
 * @openapi
 * /matching/run:
 *   post:
 *     tags: [Matching]
 *     summary: Run shipment–vehicle matching
 *     description: Admin matches fleet-wide; company user only matches own fleet vehicles.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId: { type: string, format: uuid }
 *               limit: { type: integer, minimum: 1, maximum: 50, default: 25 }
 *     responses:
 *       200:
 *         description: Matching results
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
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
  '/run',
  authenticate,
  requireRoles('admin', 'company'),
  sanitizeBody,
  validate(runMatchingSchema, 'body'),
  matchingController.run,
);

export default router;
