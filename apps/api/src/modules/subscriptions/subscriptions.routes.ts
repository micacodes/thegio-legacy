import { Router } from 'express';
import { createCheckoutSession, handleStripeWebhook } from './subscriptions.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

// The webhook needs the raw body to verify the signature.
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;