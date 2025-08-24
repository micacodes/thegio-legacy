// path: apps/api/src/serverless.ts
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
// 'path' and 'config' are not needed in this serverless entrypoint,
// as the individual modules will import 'config' themselves.

// Import ALL routers
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/uploads/uploads.routes';
// --- FIX: Corrected import path for admin routes ---
import adminRoutes from './modules/admin/admin.routes'; 

const app = express();

// --- Middleware Setup ---
// These are applied to all routes that follow.
app.use(cors({ origin: '*' })); // Use a more permissive CORS for serverless
app.use(express.json());

// --- API Route Registration ---
// The routes are registered directly on the 'app' instance.
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/templates', templateRoutes);
app.use('/subscriptions', subscriptionRoutes); 
app.use('/uploads', uploadRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', paymentRoutes);

// --- Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// --- THIS IS THE FIX ---
// The `netlify.toml` handles the `/api` prefix. This file should not.
// The `serverless-http` wrapper takes care of the rest.
export const handler = serverless(app);