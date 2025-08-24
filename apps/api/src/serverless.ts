// path: apps/api/src/serverless.ts
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';

// ... (all your route imports)
import authRoutes from './modules/auth/auth.routes';
// ... etc ...

const app = express();

// --- THIS IS THE FIX ---
// We are explicitly telling the server which frontend URL is allowed to access it.
const allowedOrigins = [
  'https://thegiolegacybooks.netlify.app',
  'http://localhost:3000' // It's good practice to keep localhost for local testing
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

// Use the configured CORS options
app.use(cors(corsOptions));
// -----------------------

app.use(express.json());

// --- API Route Registration ---
// In a serverless setup, we don't need a router or path prefix here.
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/templates', templateRoutes);
app.use('/subscriptions', subscriptionRoutes); 
app.use('/uploads', uploadRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', paymentRoutes);
app.use('/health', (req, res) => res.status(200).json({ status: 'OK' }));

export const handler = serverless(app);