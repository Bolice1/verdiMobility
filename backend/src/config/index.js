const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const portRaw = process.env.PORT;
export const env = {
  port: Number.parseInt(portRaw && portRaw !== '' ? portRaw : '4000', 10) || 4000,
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

  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
  matchingScorer: process.env.MATCHING_SCORER ?? 'v1',
  vehicleLitersPer100km: Number.parseFloat(process.env.VEHICLE_L_PER_100KM ?? '8'),
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
}
