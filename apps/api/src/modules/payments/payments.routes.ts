// path: apps/api/src/modules/payments/payments.routes.ts
import { Router } from 'express';
import { initiateMpesaPayment } from './payments.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/mpesa/initiate', authMiddleware, initiateMpesaPayment);

export default router;