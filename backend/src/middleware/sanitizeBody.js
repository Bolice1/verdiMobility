import { sanitizeObject } from '../utils/sanitize.js';

export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    req.body = sanitizeObject(req.body);
  }
  next();
}
