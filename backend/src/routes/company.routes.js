import { Router } from 'express';

import * as companyController from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeBody } from '../middleware/sanitizeBody.js';
import { validate } from '../middleware/validate.js';
import { createCompanySchema } from '../validators/company.validators.js';

const router = Router();

router.post(
  '/',
  authenticate,
  sanitizeBody,
  validate(createCompanySchema, 'body'),
  companyController.create,
);

export default router;
