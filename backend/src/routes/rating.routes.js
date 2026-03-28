import { Router } from 'express';

import { authenticate, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as ratingController from '../controllers/rating.controller.js';
import {
  createRatingSchema,
  driverIdParamsSchema,
  listDriverRatingsSchema,
} from '../validators/rating.validators.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRoles('user', 'admin'),
  validate(createRatingSchema),
  ratingController.createRating,
);

router.get(
  '/drivers/:driverId',
  authenticate,
  validate(driverIdParamsSchema, 'params'),
  validate(listDriverRatingsSchema, 'query'),
  ratingController.listDriverRatings,
);

export default router;
