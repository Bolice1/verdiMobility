import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listUsersQuerySchema } from '../validators/user.validators.js';

const router = Router();

router.get('/me', authenticate, userController.me);
router.get(
  '/',
  authenticate,
  requireRoles('admin'),
  validate(listUsersQuerySchema, 'query'),
  userController.list,
);

export default router;
