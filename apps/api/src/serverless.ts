// path: apps/api/src/serverless.ts
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { config } from './config';

// Import ALL routers
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/uploads/uploads.routes';
import adminRoutes from './modules-admin/admin.routes';

const app = express();

// Use a router to prefix all routes with /api
const router = express.Router();

// --- Middleware Setup ---
router.use(cors({ origin: '*' })); // Use a more permissive CORS for serverless
router.use(express.json());

// --- API Route Registration ---
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/templates', templateRoutes);
router.use('/subscriptions', subscriptionRoutes); 
router.use('/uploads', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

// --- Health Check Route ---
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// Mount the router with the /api prefix
app.use('/api/', router);

// Export the handler for Netlify
export const handler = serverless(app);