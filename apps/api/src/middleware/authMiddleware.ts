// path: apps/api/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppJWTPayload } from '../types.d'; // Import our global type

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];
  const decodedPayload = await verifyToken(token);

  if (!decodedPayload) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  
  req.user = decodedPayload; // This will now be type-safe
  next();
};