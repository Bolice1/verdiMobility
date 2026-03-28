const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(query) {
  const limitRaw = Number.parseInt(String(query.limit ?? ''), 10);
  const offsetRaw = Number.parseInt(String(query.offset ?? '0'), 10);

  let limit = Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  let offset = Number.isFinite(offsetRaw) ? offsetRaw : 0;
  if (offset < 0) offset = 0;

  return { limit, offset };
}

export function paginationMeta({ total, limit, offset }) {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}
