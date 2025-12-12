import mongoose from 'mongoose';

import config from '@/config';
import { logger } from '@/lib/winston';

import type { ConnectOptions } from 'mongoose';

const client: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'BlogApp',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDb = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(config.MONGO_URI, client);
    logger.info('Connected to Database successfully');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error(
      'Unknown error occurred while connecting to the database',
      error,
    );
  }
};

export const disconnectFromDb = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.warn('Disconnected from Database');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error(
      'Unknown error occurred while disconnecting from the database',
      error,
    );
  }
};
