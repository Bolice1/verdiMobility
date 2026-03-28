import { Router } from 'express';

import * as shipmentController from '../controllers/shipment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  createShipmentSchema,
  listShipmentsQuerySchema,
  patchShipmentStatusSchema,
  patchShipmentImpactSchema,
  shipmentIdParamsSchema,
} from '../validators/shipment.validators.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  sanitizeBody,
  validate(createShipmentSchema, 'body'),
  shipmentController.create,
);
router.get('/', validate(listShipmentsQuerySchema, 'query'), shipmentController.list);
router.get('/:id', validate(shipmentIdParamsSchema, 'params'), shipmentController.getById);
router.patch(
  '/:id/status',
  sanitizeBody,
  validate(shipmentIdParamsSchema, 'params'),
  validate(patchShipmentStatusSchema, 'body'),
  shipmentController.patchStatus,
);

router.patch(
  '/:id/impact',
  sanitizeBody,
  validate(shipmentIdParamsSchema, 'params'),
  validate(patchShipmentImpactSchema, 'body'),
  shipmentController.patchImpact,
);

export default router;
