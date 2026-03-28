import { createHash, randomBytes } from 'node:crypto';

export function hashToken(rawToken) {
  return createHash('sha256').update(String(rawToken), 'utf8').digest('hex');
}

export function generateRawToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}
