import { Router } from 'express';

import * as shipmentController from '../controllers/shipment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  createShipmentSchema,
  listShipmentsQuerySchema,
  patchShipmentStatusSchema,
  shipmentIdParamsSchema,
} from '../validators/shipment.validators.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /shipments:
 *   post:
 *     tags: [Shipments]
 *     summary: Create shipment (sender)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pickupLocation, destination, weight, price]
 *             properties:
 *               pickupLocation: { type: string, minLength: 1, maxLength: 500 }
 *               destination: { type: string, minLength: 1, maxLength: 500 }
 *               weight: { type: number, exclusiveMinimum: 0, maximum: 1000000 }
 *               price: { type: number, minimum: 0, maximum: 1000000000 }
 *     responses:
 *       201:
 *         description: Shipment created
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
  '/',
  sanitizeBody,
  validate(createShipmentSchema, 'body'),
  shipmentController.create,
);

/**
 * @openapi
 * /shipments:
 *   get:
 *     tags: [Shipments]
 *     summary: List shipments (role-scoped)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, matched, in_transit, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Paginated shipments
 *       401:
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
router.get('/', validate(listShipmentsQuerySchema, 'query'), shipmentController.list);

/**
 * @openapi
 * /shipments/{id}:
 *   get:
 *     tags: [Shipments]
 *     summary: Get shipment by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Shipment
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
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/:id', validate(shipmentIdParamsSchema, 'params'), shipmentController.getById);

/**
 * @openapi
 * /shipments/{id}/status:
 *   patch:
 *     tags: [Shipments]
 *     summary: Update shipment status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, matched, in_transit, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Updated shipment
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
  '/:id/status',
  sanitizeBody,
  validate(shipmentIdParamsSchema, 'params'),
  validate(patchShipmentStatusSchema, 'body'),
  shipmentController.patchStatus,
);

export default router;
