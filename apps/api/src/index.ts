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

// --- THE DEFINITIVE CORS FIX ---
// This explicitly allows your live frontend. There is no room for error.
app.use(cors({
  origin: "https://thegiolegacybooks.netlify.app"
}));
// ------------------------------------

// Stripe webhook must come BEFORE express.json()
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));
app.post('/api/subscriptions/webhook', subscriptionRoutes);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  // --- THIS IS OUR "FINGERPRINT" ---
  // We add a version number to prove this code is deployed.
  res.status(200).json({ 
    status: 'OK', 
    message: 'Thegio API is online',
    version: '1.1.0' // This is our proof
  });
});

app.listen(config.port, async () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  await registerDarajaUrls();
});