import dotenv from 'dotenv';
dotenv.config();

import type ms from 'ms';

const config = {
  PORT: process.env.PORT! || 8000,
  NODE_ENV: process.env.NODE_ENV!,
  WHITELIST_ORIGINS: ['http://example.com', 'http://anotherdomain.com'],
  MONGO_URI: process.env.MONGO_URI!,
  LOG_LEVEL: process.env.LOG_LEVEL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES! as ms.StringValue,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES! as ms.StringValue,
  WHITELIST_ADMINS_MAIL: [
    'akshitmeshram15@gmail.com',
    'meshramakshit15@gmail.com',
  ],
};

export default config;
