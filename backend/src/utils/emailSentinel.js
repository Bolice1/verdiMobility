import dns from 'node:dns/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const disposableList = require('disposable-email-domains');
const disposableSet = new Set(
  (Array.isArray(disposableList) ? disposableList : []).map((d) =>
    String(d).toLowerCase(),
  ),
);

const ROLE_PREFIXES = [
  'noreply',
  'no-reply',
  'postmaster',
  'mailer-daemon',
  'abuse',
];

/**
 * Validates format, disposable list, role local-part, and MX (or A) DNS.
 */
export async function validateEmailSentinel(email) {
  const errors = [];
  const normalized = String(email ?? '').trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    errors.push('Invalid email format.');
    return { valid: false, errors };
  }

  const [local, domainRaw] = normalized.split('@');
  const domain = domainRaw?.toLowerCase();
  if (!domain) {
    errors.push('Invalid email format.');
    return { valid: false, errors };
  }

  if (disposableSet.has(domain)) {
    errors.push('Disposable email addresses are not allowed.');
  }

  const prefix = local.toLowerCase();
  if (ROLE_PREFIXES.some((r) => prefix === r || prefix.startsWith(`${r}.`))) {
    errors.push('Role-based email addresses are not allowed.');
  }

  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      errors.push('Email domain has no mail server (MX record missing).');
    }
  } catch {
    try {
      await dns.resolve4(domain);
    } catch {
      errors.push('Email domain could not be verified.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
