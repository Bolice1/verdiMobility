import { Router } from 'express';

import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/impact', authenticate, requireRoles('admin', 'company'), analyticsController.impact);

export default router;
