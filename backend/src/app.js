import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/index.js';
import { swaggerSpec } from './config/swagger.js';
import { pool } from './database/pool.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';
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

const apiHelmet = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  strictTransportSecurity: {
    maxAge: 31_536_000,
    includeSubDomains: true,
    preload: true,
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
});

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestId);

  app.use(
    '/api-docs',
    helmet({ contentSecurityPolicy: false }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'verdiMobility API',
    }),
  );

  app.use(apiHelmet);
  app.use(cors(corsOptions()));
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      limit: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) =>
        req.path === '/health' ||
        req.path.startsWith('/api-docs') ||
        req.path === '/openapi.json',
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  app.get('/health', async (_req, res) => {
    let dbStatus = 'disconnected';
    try {
      await pool.query('SELECT 1 AS ok');
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }
    res.status(200).json({
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      db: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use('/api', api);

  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      code: 'NOT_FOUND',
      requestId: req.id,
    });
  });

  app.use(errorHandler);

  return app;
}
