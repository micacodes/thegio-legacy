// path: apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import { config } from './config';
import uploadRoutes from './modules/uploads/uploads.routes'

// --- Corrected Import Paths ---
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/templates.routes'; // Corrected filename
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';

const app = express();

// --- Middleware ---
app.use(cors({ origin: config.frontendUrl }));

// Stripe webhook must come BEFORE express.json() to get the raw body
app.use('/api/subscriptions/webhook', subscriptionRoutes);

app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes); // This handles the other subscription routes
app.use('/api/uploads', uploadRoutes);
import path from 'path'; 

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Start Server ---
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});