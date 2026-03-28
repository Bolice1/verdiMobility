import 'dotenv/config';

import http from 'node:http';

import { createApp } from './src/app.js';
import { env, assertRequiredEnv } from './src/config/index.js';
import { pool } from './src/database/pool.js';
import { logger } from './src/utils/logger.js';

function shutdown(signal) {
  return async () => {
    logger.info(`Received ${signal}, shutting down`);
    await pool.end().catch((err) => logger.error('Pool end error', { err }));
    process.exit(0);
  };
}

async function main() {
  assertRequiredEnv();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`verdiMobility API listening on port ${env.port}`, {
      nodeEnv: env.nodeEnv,
    });
  });

  process.on('SIGINT', shutdown('SIGINT'));
  process.on('SIGTERM', shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error('Fatal startup error', { err });
  process.exit(1);
});
