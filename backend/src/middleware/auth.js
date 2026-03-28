import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new AppError('Missing bearer token', 401, 'UNAUTHORIZED'));
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    next(new AppError('Missing bearer token', 401, 'UNAUTHORIZED'));
    return;
  }
  try {
    const decoded = verifyAccessToken(token);
    const sub = decoded.sub;
    if (!sub) {
      next(new AppError('Invalid token payload', 401, 'INVALID_TOKEN'));
      return;
    }
    req.user = {
      id: sub,
      role: decoded.role,
      companyId: decoded.companyId ?? null,
    };
    next();
  } catch (e) {
    next(e);
  }
}

export function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'));
      return;
    }
    next();
  };
}
