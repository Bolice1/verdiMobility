import { Router } from 'express';

import * as matchingController from '../controllers/matching.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import { runMatchingSchema } from '../validators/matching.validators.js';

const router = Router();

router.post(
  '/run',
  authenticate,
  requireRoles('admin', 'company'),
  sanitizeBody,
  validate(runMatchingSchema, 'body'),
  matchingController.run,
);

export default router;
