import 'dotenv/config';

import http from 'node:http';

import { createApp } from './src/app.js';
import { env, assertRequiredEnv } from './src/config/index.js';
import { closePool, verifyDatabaseConnection } from './src/config/database.js';
import { logger } from './src/utils/logger.js';

const PORT = Number.parseInt(process.env.PORT || '5987', 10) || 5987;

function shutdown(signal) {
  return async () => {
    logger.info(`Received ${signal}, shutting down`);
    await closePool().catch((err) => logger.error('Pool end error', { message: err?.message }));
    process.exit(0);
  };
}

async function main() {
  assertRequiredEnv();

  try {
    await verifyDatabaseConnection();
    logger.info('PostgreSQL connection verified');
  } catch (err) {
    logger.error('Cannot start server: database is not available', {
      message: err?.message,
      code: err?.code,
    });
    process.exit(1);
  }

  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`verdiMobility API listening on port ${PORT}`, {
      nodeEnv: env.nodeEnv,
    });
  });

  process.on('SIGINT', shutdown('SIGINT'));
  process.on('SIGTERM', shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error('Fatal startup error', { message: err?.message });
  process.exit(1);
});
