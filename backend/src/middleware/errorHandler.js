import { env } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';
import { isHttpLikeError } from '../utils/errors.js';

function isZodError(err) {
  return err && Array.isArray(err.issues);
}

function requestIdFromReq(req) {
  return req?.id ?? undefined;
}

export function errorHandler(err, req, res, next) {
  const requestId = requestIdFromReq(req);

  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({
      error: 'Invalid JSON payload',
      code: 'INVALID_JSON',
      requestId,
    });
    return;
  }

  if (isZodError(err)) {
    logger.warn('Validation error', {
      requestId,
      path: req.originalUrl,
      userId: req.user?.id,
      issues: err.issues,
    });
    const body = {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      requestId,
    };
    if (!env.isProduction) {
      body.details = err.issues;
    }
    res.status(400).json(body);
    return;
  }

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, {
        requestId,
        code: err.code,
        userId: req.user?.id,
        details: err.details,
      });
    } else {
      logger.warn(err.message, {
        requestId,
        code: err.code,
        userId: req.user?.id,
      });
    }
    const bodyProd = {
      error: err.message,
      code: err.code,
      requestId,
    };
    if (!env.isProduction && err.details) {
      bodyProd.details = err.details;
    }
    res.status(err.statusCode).json(bodyProd);
    return;
  }

  if (isHttpLikeError(err)) {
    const level = err.statusCode >= 500 ? 'error' : 'warn';
    logger[level](err.message, {
      requestId,
      code: err.code,
      name: err.name,
      userId: req.user?.id,
    });
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      requestId,
    });
    return;
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    logger.warn('JWT error', {
      name: err.name,
      requestId,
      path: req.originalUrl,
    });
    res.status(401).json({
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
      requestId,
    });
    return;
  }

  logger.error('Unhandled error', {
    requestId,
    message: err?.message,
    stack: env.isProduction ? undefined : err?.stack,
    path: req.originalUrl,
    userId: req.user?.id,
  });

  const body = {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    requestId,
  };
  if (!env.isProduction && err?.stack) {
    body.stack = err.stack;
  }
  res.status(500).json(body);
}
