/**
 * Normalize and tokenize location strings for similarity checks.
 */
function tokens(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Jaccard similarity between token sets; also boosts substring overlap.
 */
export function destinationsAreSimilar(a, b, threshold = 0.28) {
  if (!a || !b) return false;
  const ta = new Set(tokens(String(a)));
  const tb = new Set(tokens(String(b)));
  if (ta.size === 0 || tb.size === 0) return false;

  let inter = 0;
  for (const t of ta) {
    if (tb.has(t)) inter += 1;
  }
  const union = ta.size + tb.size - inter;
  const jaccard = inter / union;

  const sa = String(a).toLowerCase();
  const sb = String(b).toLowerCase();
  const contains = sa.includes(sb) || sb.includes(sa);

  return contains || jaccard >= threshold;
}
