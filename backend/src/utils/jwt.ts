import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any,
  };
  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
