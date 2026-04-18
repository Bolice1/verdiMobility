import { Router } from 'express';

import * as paymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  createPaymentSchema,
  listPaymentsQuerySchema,
  paymentIdParamsSchema,
  refundPaymentSchema,
  updatePaymentStatusSchema,
} from '../validators/payment.validators.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Start or restart a shipment payment workflow
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shipmentId]
 *             properties:
 *               shipmentId: { type: string, format: uuid }
 *               amount: { type: number, exclusiveMinimum: 0 }
 *               currency: { type: string, minLength: 3, maxLength: 3, example: USD }
 *               paymentMethod: { type: string, enum: [card, bank_transfer, wallet, mobile_money, invoice] }
 *               provider: { type: string }
 *               externalReference: { type: string }
 *               providerReference: { type: string }
 *               metadata: { type: object, additionalProperties: true }
 *     responses:
 *       201:
 *         description: Payment workflow created
 */
router.post(
  '/',
  sanitizeBody,
  validate(createPaymentSchema, 'body'),
  paymentController.create,
);

/**
 * @openapi
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: List payments visible to the authenticated actor
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: shipmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, authorized, processing, completed, failed, cancelled, partially_refunded, refunded]
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Paginated payments
 */
router.get('/', validate(listPaymentsQuerySchema, 'query'), paymentController.list);

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get('/:id', validate(paymentIdParamsSchema, 'params'), paymentController.getById);

/**
 * @openapi
 * /payments/{id}/status:
 *   patch:
 *     tags: [Payments]
 *     summary: Update payment processing status (admin)
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
 *                 enum: [pending, authorized, processing, completed, failed, cancelled, partially_refunded, refunded]
 *               providerReference: { type: string }
 *               failureCode: { type: string }
 *               failureMessage: { type: string }
 *               metadata: { type: object, additionalProperties: true }
 *     responses:
 *       200:
 *         description: Updated payment
 */
router.patch(
  '/:id/status',
  sanitizeBody,
  validate(paymentIdParamsSchema, 'params'),
  validate(updatePaymentStatusSchema, 'body'),
  paymentController.patchStatus,
);

/**
 * @openapi
 * /payments/{id}/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Refund a completed payment (admin)
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
 *             required: [amount, reason]
 *             properties:
 *               amount: { type: number, exclusiveMinimum: 0 }
 *               reason: { type: string }
 *               metadata: { type: object, additionalProperties: true }
 *     responses:
 *       200:
 *         description: Refunded payment
 */
router.post(
  '/:id/refund',
  sanitizeBody,
  validate(paymentIdParamsSchema, 'params'),
  validate(refundPaymentSchema, 'body'),
  paymentController.refund,
);

export default router;
