const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const portNum = Number.parseInt(process.env.PORT || '5987', 10) || 5987;

export const env = {
  port: portNum,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',

  databaseUrl: process.env.DATABASE_URL ?? '',

  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',

  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  rateLimitWindowMs: Number.parseInt(
    process.env.RATE_LIMIT_WINDOW_MS ?? '900000',
    10,
  ),
  rateLimitMax: Number.parseInt(process.env.RATE_LIMIT_MAX ?? '200', 10),

  bcryptRounds: Number.parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10),

  appUrl: (process.env.APP_URL || `http://localhost:${portNum}`).replace(/\/$/, ''),
  frontendUrl: (process.env.FRONTEND_URL || '').replace(/\/$/, ''),
  emailVerificationUrl: process.env.EMAIL_VERIFICATION_URL ?? '',
  passwordResetUrl: process.env.PASSWORD_RESET_URL ?? '',

  emailEnabled: process.env.EMAIL_ENABLED === 'true',
  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',

  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'verdiMobility <no-reply@verdimobility.com>',

  adminAlertEmail: process.env.ADMIN_ALERT_EMAIL ?? '',

  paymentDefaultCurrency: (process.env.PAYMENT_DEFAULT_CURRENCY ?? 'USD')
    .trim()
    .toUpperCase(),
};

export function assertRequiredEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (env.jwtSecret.length < 32 || env.jwtRefreshSecret.length < 32) {
    throw new Error(
      'JWT_SECRET and JWT_REFRESH_SECRET must each be at least 32 characters long',
    );
  }
  if (env.emailEnabled) {
    const smtpMissing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'].filter(
      (k) => !process.env[k],
    );
    if (smtpMissing.length > 0) {
      throw new Error(
        `EMAIL_ENABLED=true requires: ${smtpMissing.join(', ')}`,
      );
    }
  }
}
