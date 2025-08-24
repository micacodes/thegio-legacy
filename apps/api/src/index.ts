// path: apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { config } from './config';

// --- All Route Imports ---
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/uploads/uploads.routes';
import adminRoutes from './modules/admin/admin.routes';
import { registerDarajaUrls } from './services/darajaUrlService';

const app = express();

// --- THIS IS THE FIX ---
// We now allow multiple origins: your live Netlify frontend and your local frontend.
const allowedOrigins = [
  'https://thegiolegacybooks.netlify.app',
  'http://localhost:3000' 
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the new, more flexible CORS configuration
app.use(cors(corsOptions));
// -----------------------

// Stripe webhook must come BEFORE express.json()
// We also need to add the correct /api prefix for the live server
app.use('/api/subscriptions/webhook', subscriptionRoutes);

// This middleware is for parsing JSON bodies in requests
app.use(express.json());

// This middleware is for serving static files (like images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Route Registration ---
// All routes are prefixed with /api
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// --- Start Server ---
app.listen(config.port, async () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  await registerDarajaUrls();
});