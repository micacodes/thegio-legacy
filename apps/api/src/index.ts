// path: apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { config } from './config';

// Import all routers
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/uploads/uploads.routes';
import adminRoutes from './modules/admin/admin.routes';
import { registerDarajaUrls } from './services/darajaUrlService';

const app = express();

// --- Definitive CORS Configuration ---
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
// ------------------------------------

// --- Middleware ---
// IMPORTANT: The Stripe webhook has a very specific path and needs the raw body.
// We handle it here, BEFORE the general /api router.
app.post('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), subscriptionRoutes);

// General JSON parser for all other routes
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- THE DEFINITIVE ROUTING FIX ---
// We create a master router and attach all other routes to it.
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/templates', templateRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/admin', adminRoutes);
// Note: We leave '/subscriptions' out of this main router because the webhook is handled separately.
// If you have other subscription routes like '/create-checkout-session', they should be added here.
apiRouter.use('/subscriptions', subscriptionRoutes); 

apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.3.0' }); // New fingerprint
});

// We mount the entire collection of routes under the `/api` prefix.
app.use('/api', apiRouter);
// ------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await registerDarajaUrls();
});