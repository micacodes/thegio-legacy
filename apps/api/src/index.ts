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

/**
 * ✅ CORS FIX
 * Allow both your Netlify frontend & local frontend.
 * Also handle preflight OPTIONS requests properly.
 */
const allowedOrigins = [
  'https://thegiolegacybooks.netlify.app',
  'http://localhost:3000',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests like Postman with no origin
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // ✅ allow cookies & auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle preflight requests (important for browsers)
app.options('*', cors(corsOptions));

/**
 * ✅ Stripe webhook
 * Must come BEFORE express.json() because Stripe sends raw body
 */
app.use('/api/subscriptions/webhook', subscriptionRoutes);

// Middleware to parse JSON
app.use(express.json());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// --- Start Server ---
app.listen(config.port, async () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  await registerDarajaUrls();
});
