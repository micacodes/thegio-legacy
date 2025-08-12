import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { stripe, paymentService } from '../../services/paymentService';
import { config } from '../../config';

const prisma = new PrismaClient();

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId } = req.body; // e.g., 'price_12345' from your Stripe dashboard
  const userId = req.user!.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ message: 'User or Stripe customer not found.' });
    }
    const session = await paymentService.createCheckoutSessionForSubscription(user.stripeCustomerId, priceId);
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create subscription checkout session' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // If it's a subscription, handle subscription creation
      if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await prisma.user.update({
          where: { stripeCustomerId: session.customer },
          data: {
            subscription: {
              create: {
                stripeSubscriptionId: subscription.id,
                planId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            },
          },
        });
      }
      // If it's a one-time payment, create the order record
      if (session.mode === 'payment') {
          // This is where you would create the 'Order' in your database
          console.log('One-time payment successful for session:', session.id);
          // const customer = await prisma.user.findUnique({ where: { stripeCustomerId: session.customer } });
          // await prisma.order.create({ ... });
      }
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscriptionUpdated = event.data.object;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionUpdated.id },
        data: {
          status: subscriptionUpdated.status,
          currentPeriodEnd: new Date(subscriptionUpdated.current_period_end * 1000),
        },
      });
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};