import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import v1Route from '@/routes/V1';

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDb, disconnectFromDb } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

import type { CorsOptions } from 'cors';

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Cors Error: Origin ${origin} not allowed`), false);
      logger.warn(`Cors Error: Origin ${origin} not allowed`);
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(limiter);

app.use(
  compression({
    threshold: 1024,
  }),
);

app.use(helmet());

(async () => {
  try {
    await connectToDb();
    app.use('/api/v1', v1Route);
    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handelServerShutdown = async () => {
  try {
    await disconnectFromDb();
    logger.warn('Shutting down server gracefully...');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', error);
  }
};

process.on('SIGTERM', handelServerShutdown);
process.on('SIGINT', handelServerShutdown);
