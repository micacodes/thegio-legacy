// path: apps/api/src/modules/orders/orders.routes.ts
import { Router } from 'express';
import { createOrderCheckoutSession } from './orders.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/create-checkout-session', authMiddleware, createOrderCheckoutSession);

export default router; 