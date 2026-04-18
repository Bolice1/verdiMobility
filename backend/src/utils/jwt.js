import jwt from 'jsonwebtoken';

import { env } from '../config/index.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn,
    issuer: 'verdimobility',
    audience: 'verdimobility-clients',
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
    issuer: 'verdimobility',
    audience: 'verdimobility-refresh',
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret, {
    issuer: 'verdimobility',
    audience: 'verdimobility-clients',
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret, {
    issuer: 'verdimobility',
    audience: 'verdimobility-refresh',
  });
}
