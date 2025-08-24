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
// This explicitly allows your live frontend URL.
const allowedOrigins = [
  'https://thegiolegacybooks.netlify.app',
  'http://localhost:3000'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or from our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  credentials: true, // Add this if you're using cookies/auth tokens
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the correct and final CORS configuration
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions)); // THIS IS THE CRITICAL FIX
// ------------------------------------

// Stripe webhook must come BEFORE express.json()
// We add the /api prefix to match the live server's path structure
app.use('/api/subscriptions/webhook', subscriptionRoutes);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// All routes are prefixed with /api
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  // --- THE "FINGERPRINT" ---
  // This proves the new code is deployed.
  res.status(200).json({ 
    status: 'OK', 
    message: 'Thegio API is online',
    version: '1.2.1' // Updated version number for this fix
  });
});

// For Render, we need to read the port from the environment.
// config.port is likely trying to use a value from .env which might not exist on Render.
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await registerDarajaUrls();
});