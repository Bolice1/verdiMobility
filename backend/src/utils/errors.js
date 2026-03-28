export class ValidationError extends Error {
  constructor(message, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 422;
    this.code = code;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = code;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.code = code;
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.code = code;
  }
}

/** True for application errors that carry HTTP status + code */
export function isHttpLikeError(err) {
  return Boolean(
    err &&
      typeof err.statusCode === 'number' &&
      typeof err.code === 'string',
  );
}
