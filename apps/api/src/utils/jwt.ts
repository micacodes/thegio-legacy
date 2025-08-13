// path: apps/api/src/utils/jwt.ts
import * as jose from 'jose';
import { config } from '../config';

// This is the FIX:
// We are telling TypeScript that our payload is a valid jose.JWTPayload
// that ALSO includes our specific 'id' and 'role' fields.
export interface AppJWTPayload extends jose.JWTPayload {
  id: string;
  role: string;
}

const secretKey = new TextEncoder().encode(config.jwt.secret);

export const generateToken = async (payload: AppJWTPayload): Promise<string> => {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .sign(secretKey);
  return jwt;
};

export const verifyToken = async (token: string): Promise<AppJWTPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    
    // No need to cast with 'as' anymore, because the types are now compatible.
    // We just do a safety check.
    if (payload && typeof payload.id === 'string' && typeof payload.role === 'string') {
      return payload as AppJWTPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
};