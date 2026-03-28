import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { openApiSpec } from './docs/openapi.js';
import { env } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import api from './routes/index.js';

function corsOptions() {
  if (env.corsOrigin === '*') {
    return { origin: true, credentials: true };
  }
  const allowed = new Set(
    env.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean),
  );
  return {
    origin(origin, callback) {
      if (!origin || allowed.has(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  };
}

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors(corsOptions()));
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      limit: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'verdiMobility-api' });
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'verdiMobility API',
    }),
  );

  app.use('/api', api);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
  });

  app.use(errorHandler);

  return app;
}
