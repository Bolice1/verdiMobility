import { Router } from 'express';

import * as adminController from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { adminAudit } from '../middleware/adminAudit.js';
import { validate } from '../middleware/validate.js';
import {
  adminListQuerySchema,
  adminPatchUserBodySchema,
  adminStatsQuerySchema,
  adminUserIdParamsSchema,
} from '../validators/admin.validators.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));
router.use(adminAudit);

/**
 * @openapi
 * /admin/overview:
 *   get:
 *     tags: [Admin]
 *     summary: System-wide counts and revenue snapshot
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Aggregated overview
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.patch(
  '/users/:id',
  sanitizeBody,
  validate(adminUserIdParamsSchema, 'params'),
  validate(adminPatchUserBodySchema, 'body'),
  adminController.patchUser,
);

router.get('/overview', adminController.overview);

/**
 * @openapi
 * /admin/companies:
 *   get:
 *     tags: [Admin]
 *     summary: All companies with vehicle counts
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Paginated companies
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
router.get(
  '/companies',
  validate(adminListQuerySchema, 'query'),
  adminController.companies,
);

/**
 * @openapi
 * /admin/vehicles:
 *   get:
 *     tags: [Admin]
 *     summary: Global fleet view
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Paginated vehicles with routes
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
router.get(
  '/vehicles',
  validate(adminListQuerySchema, 'query'),
  adminController.vehicles,
);

/**
 * @openapi
 * /admin/shipments:
 *   get:
 *     tags: [Admin]
 *     summary: All shipments with sender and vehicle
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Paginated shipments
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
router.get(
  '/shipments',
  validate(adminListQuerySchema, 'query'),
  adminController.shipments,
);

/**
 * @openapi
 * /admin/payments:
 *   get:
 *     tags: [Admin]
 *     summary: All payments with status summary
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Payments and rollup
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
router.get(
  '/payments',
  validate(adminListQuerySchema, 'query'),
  adminController.payments,
);

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Analytics — time series and utilization
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, minimum: 1, maximum: 365, default: 30 }
 *         description: Lookback window in days
 *     responses:
 *       200:
 *         description: Stats payload
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
router.get('/stats', validate(adminStatsQuerySchema, 'query'), adminController.stats);

export default router;
