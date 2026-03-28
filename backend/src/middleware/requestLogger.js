import { logger } from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const started = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - started;
    const logPayload = {
      method: req.method,
      path: req.originalUrl ?? req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    };
    if (res.statusCode >= 500) {
      logger.error('HTTP request', logPayload);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP request', logPayload);
    } else {
      logger.info('HTTP request', logPayload);
    }
  });
  next();
}
