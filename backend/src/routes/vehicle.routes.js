import { Router } from 'express';

import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  createVehicleSchema,
  listVehiclesQuerySchema,
  patchVehicleSchema,
  vehicleIdParamsSchema,
} from '../validators/vehicle.validators.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Register a vehicle
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyId, plateNumber, capacity]
 *             properties:
 *               companyId: { type: string, format: uuid }
 *               driverId: { type: string, format: uuid, nullable: true }
 *               plateNumber: { type: string, minLength: 2, maxLength: 32 }
 *               capacity: { type: number, exclusiveMinimum: 0, maximum: 1000000 }
 *               status:
 *                 type: string
 *                 enum: [available, busy, maintenance, inactive]
 *                 default: available
 *     responses:
 *       201:
 *         description: Vehicle created
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Driver not found
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
  sanitizeBody,
  validate(createVehicleSchema, 'body'),
  vehicleController.create,
);

/**
 * @openapi
 * /vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: List vehicles (admin, company, or driver scope)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, busy, maintenance, inactive]
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Paginated vehicles
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
router.get('/', validate(listVehiclesQuerySchema, 'query'), vehicleController.list);

/**
 * @openapi
 * /vehicles/{id}:
 *   patch:
 *     tags: [Vehicles]
 *     summary: Update vehicle
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               driverId: { type: string, format: uuid, nullable: true }
 *               plateNumber: { type: string, minLength: 2, maxLength: 32 }
 *               capacity: { type: number, exclusiveMinimum: 0, maximum: 1000000 }
 *               status:
 *                 type: string
 *                 enum: [available, busy, maintenance, inactive]
 *     responses:
 *       200:
 *         description: Updated vehicle
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       403:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
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
router.patch(
  '/:id',
  sanitizeBody,
  validate(vehicleIdParamsSchema, 'params'),
  validate(patchVehicleSchema, 'body'),
  vehicleController.patch,
);

export default router;
