import { Router } from 'express';

import * as adminController from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { adminAudit } from '../middleware/adminAudit.js';
import { validate } from '../middleware/validate.js';
import {
  adminListQuerySchema,
  adminStatsQuerySchema,
} from '../validators/admin.validators.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));
router.use(adminAudit);

router.get('/overview', adminController.overview);
router.get(
  '/companies',
  validate(adminListQuerySchema, 'query'),
  adminController.companies,
);
router.get(
  '/vehicles',
  validate(adminListQuerySchema, 'query'),
  adminController.vehicles,
);
router.get(
  '/shipments',
  validate(adminListQuerySchema, 'query'),
  adminController.shipments,
);
router.get(
  '/payments',
  validate(adminListQuerySchema, 'query'),
  adminController.payments,
);
router.get('/stats', validate(adminStatsQuerySchema, 'query'), adminController.stats);

export default router;
