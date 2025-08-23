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
import paymentRoutes from './modules/payments/payments.routes'; // <-- THE FIX: Import payment routes
import uploadRoutes from './modules/uploads/uploads.routes';
import adminRoutes from './modules/admin/admin.routes';
import { registerDarajaUrls } from './services/darajaUrlService';
const app = express();


// --- Middleware Setup ---
app.use(cors({ origin: config.frontendUrl }));

// Stripe webhook must come BEFORE express.json() to get the raw body
app.use('/api/subscriptions/webhook', subscriptionRoutes);

// This middleware is for parsing JSON bodies in requests
app.use(express.json());

// This middleware is for serving static files (like images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Route Registration ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes); // <-- THE FIX: Register the payment routes

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// --- Start Server ---
app.listen(config.port, async () => { // <-- MAKE THIS FUNCTION ASYNC
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  await registerDarajaUrls();
});