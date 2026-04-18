/**
 * Trims strings recursively on plain objects (shallow + one level arrays).
 */
export function sanitizeObject(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map((v) => sanitizeObject(v));
  if (typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeObject(v)]),
    );
  }
  return value;
}
