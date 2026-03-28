import { logger } from '../utils/logger.js';

export function adminAudit(req, _res, next) {
  logger.info('Admin control room access', {
    requestId: req.id,
    userId: req.user?.id,
    role: req.user?.role,
    method: req.method,
    path: req.originalUrl,
  });
  next();
}
