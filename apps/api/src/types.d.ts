// path: apps/api/src/types.d.ts

// 1. Define the shape of our JWT payload
export interface AppJWTPayload {
  id: string;
  role: string;
}

// 2. Extend the global Express namespace
declare global {
  namespace Express {
    interface Request {
      user?: AppJWTPayload; // Add our custom 'user' property to all Requests
    }
  }
}