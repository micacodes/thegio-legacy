import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
  },
   paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
    daraja: {
    consumerKey: process.env.DARAJA_CONSUMER_KEY!,
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET!,
    shortcode: process.env.DARAJA_SHORTCODE!,
    passkey: process.env.DARAJA_PASSKEY!,
    callbackUrl: process.env.DARAJA_CALLBACK_URL!,
    // The sandbox URL for generating tokens
    authUrl: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    // The sandbox URL for STK Push
    stkPushUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  },
  printify: { apiKey: process.env.PRINTIFY_API_KEY! },
  sendgrid: { apiKey: process.env.SENDGRID_API_KEY! },
};