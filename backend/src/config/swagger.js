import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import swaggerJsdoc from 'swagger-jsdoc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || '5987';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'verdiMobility API',
      version: '1.0.0',
      description: 'REST API documentation for the verdiMobility platform',
    },
    servers: [{ url: `http://localhost:${port}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            details: { type: 'array' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [join(__dirname, '../routes/*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);
