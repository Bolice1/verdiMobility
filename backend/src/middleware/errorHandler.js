import { env } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

function isZodError(err) {
  return err && Array.isArray(err.issues);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (isZodError(err)) {
    logger.warn('Validation error', {
      path: req.originalUrl,
      issues: err.issues,
    });
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.issues,
    });
    return;
  }

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { code: err.code, details: err.details });
    } else {
      logger.warn(err.message, { code: err.code });
    }
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    logger.warn('JWT error', { name: err.name, path: req.originalUrl });
    res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
    return;
  }

  logger.error('Unhandled error', {
    message: err?.message,
    stack: env.isProduction ? undefined : err?.stack,
    path: req.originalUrl,
  });

  const body = {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  };
  if (!env.isProduction && err?.stack) {
    body.stack = err.stack;
  }
  res.status(500).json(body);
}
