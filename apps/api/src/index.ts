import express from 'express';
import cors from 'cors';
import { config } from './config';

// Import routers
import authRoutes from './modules/auth/auth.routes';
import orderRoutes from './modules/orders/orders.routes';
import templateRoutes from './modules/templates/routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';

const app = express();

// --- Middleware ---
app.use(cors({ origin: config.frontendUrl }));

// Stripe webhook needs the raw body, so it comes before express.json()
app.use('/api/subscriptions/webhook', subscriptionRoutes);

app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
// All other subscription routes that need JSON parsing come after
app.use('/api/subscriptions', subscriptionRoutes);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Thegio API is online' });
});

// --- Start Server ---
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

