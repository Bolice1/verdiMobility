import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from '../validators/auth.validators.js';

const router = Router();

router.post(
  '/register',
  sanitizeBody,
  validate(registerSchema, 'body'),
  authController.register,
);
router.post('/login', sanitizeBody, validate(loginSchema, 'body'), authController.login);
router.post(
  '/refresh',
  sanitizeBody,
  validate(refreshSchema, 'body'),
  authController.refresh,
);

export default router;
