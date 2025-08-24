// path: apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { config } from './config';

import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/uploads/uploads.routes';
import adminRoutes from './modules/admin/admin.routes';
import { registerDarajaUrls } from './services/darajaUrlService';

const app = express();

const allowedOrigins = [
  'https://thegiolegacybooks.netlify.app',
  'http://localhost:3000'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// --- THIS IS THE FIX ---
// Create a master router for all API endpoints.
const apiRouter = express.Router();

// Register all specific routes onto the master router.
apiRouter.use('/auth', authRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/templates', templateRoutes);
apiRouter.use('/subscriptions', subscriptionRoutes); 
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/health', (req, res) => res.status(200).json({ status: 'OK', version: '1.2.1' }));

// Mount the master router at the /api prefix.
app.use('/api', apiRouter);
// -----------------------

// Stripe webhook is a special case that needs the raw body
// It needs to be registered on the app itself, BEFORE the main JSON parser.
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), subscriptionRoutes);

app.use(express.json()); // General JSON parser for other routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await registerDarajaUrls();
});