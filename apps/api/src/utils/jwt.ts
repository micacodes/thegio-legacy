import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.secret) as { id: string; role: string; };
  } catch (error) {
    return null;
  }
};