import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  const headerId = req.headers['x-request-id'];
  const id =
    typeof headerId === 'string' && headerId.trim().length > 0
      ? headerId.trim().slice(0, 128)
      : randomUUID();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
}
