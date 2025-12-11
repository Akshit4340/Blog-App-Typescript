import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  legacyHeaders: false,
  standardHeaders: 'draft-8',
  message: {
    error: 'Too many requests, please try again later.',
  },
});

export default limiter;
