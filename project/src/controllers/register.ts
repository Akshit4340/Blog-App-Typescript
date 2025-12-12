import type { Request, Response } from 'express';

import User from '@/models/user';
import Token from '@/models/token';

import { genUsername } from '@/utils';
import { logger } from '@/lib/winston';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

import type { IUser } from '@/models/user';
import config from '@/config';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body as UserData;

    if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
      res.status(403).json({
        code: 'FORBIDDEN_ADMIN_REGISTRATION',
        message: 'Registration as admin is not allowed for this email',
      });

      logger.warn('Attempt to register as admin with non-whitelisted email ', {
        email,
      });
      return;
    }

    const username = genUsername();
    const user = await User.create({ username, email, password, role });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token has been stored for the user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(201).json({
      user,
      accessToken,
    });
    logger.info('User has been registered successfully', user);
  } catch (error) {
    logger.error('Error in register controller:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export default register;
