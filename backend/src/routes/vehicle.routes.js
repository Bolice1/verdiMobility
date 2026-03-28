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

router.post(
  '/',
  sanitizeBody,
  validate(createVehicleSchema, 'body'),
  vehicleController.create,
);
router.get('/', validate(listVehiclesQuerySchema, 'query'), vehicleController.list);
router.patch(
  '/:id',
  sanitizeBody,
  validate(vehicleIdParamsSchema, 'params'),
  validate(patchVehicleSchema, 'body'),
  vehicleController.patch,
);

export default router;
