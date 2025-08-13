// path: apps/api/src/modules/orders/orders.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { paymentService } from '../../services/paymentService';

const prisma = new PrismaClient();

// This controller creates a Stripe checkout session for a one-time purchase.
// The actual order creation happens via webhook after successful payment.
export const createOrderCheckoutSession = async (req: Request, res: Response) => {
  const { amountInCents, productName } = req.body;
  const userId = req.user!.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
    
    // Example: If user has an active subscription, maybe the book is free.
    if (user?.subscription?.status === 'active') {
        console.log(`User ${userId} has an active subscription. Discount logic would apply here.`);
    }

    const session = await paymentService.createCheckoutSessionForOneTimePurchase(amountInCents, productName);
    res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};