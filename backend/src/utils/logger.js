import { createLogger, format, transports } from 'winston';

import { env } from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = format;

const lineFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}] ${message}${rest}`;
});

export const logger = createLogger({
  level: env.isProduction ? 'info' : 'debug',
  format: env.isProduction
    ? combine(errors({ stack: true }), timestamp(), format.json())
    : combine(errors({ stack: true }), timestamp(), colorize(), lineFormat),
  defaultMeta: { service: 'verdimobility-api' },
  transports: [new transports.Console()],
});
