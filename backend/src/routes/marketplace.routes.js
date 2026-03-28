import { Router } from 'express';

import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { marketplaceVehiclesQuerySchema } from '../validators/vehicle.validators.js';

const router = Router();

router.get(
  '/vehicles',
  authenticate,
  requireRoles('admin', 'company', 'user', 'driver'),
  validate(marketplaceVehiclesQuerySchema, 'query'),
  vehicleController.marketplace,
);

export default router;
