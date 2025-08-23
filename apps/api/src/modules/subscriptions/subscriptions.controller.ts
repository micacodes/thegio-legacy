// path: apps/api/src/modules/subscriptions/subscriptions.controller.ts
import { Request, Response } from 'express';
// --- FIX: REMOVED OrderType from this import ---
import { PrismaClient } from '@prisma/client';
import { stripe, paymentService } from '../../services/paymentService';
import { config } from '../../config';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// --- FIX: ADDED local type definition ---
type OrderType = 'DIY' | 'PREMIUM';

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId } = req.body;
  const userId = req.user!.id;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ message: 'User or Stripe customer not found.' });
    }
    const session = await paymentService.createCheckoutSessionForSubscription(user.stripeCustomerId, priceId);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create subscription checkout session' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;
        
        if (metadata && metadata.userId && metadata.orderType) {
            await prisma.order.create({
                data: {
                    userId: metadata.userId,
                    type: metadata.orderType as OrderType,
                    amountPaid: parseFloat(metadata.amountPaid),
                    paymentId: paymentIntent.id,
                    status: 'PAID',
                    templateId: metadata.templateId || undefined,
                    contentJson: metadata.contentJson || undefined,
                    shippingAddressJson: metadata.shippingAddressJson || undefined,
                }
            });
            console.log(`[Webhook] Successfully created order for user ${metadata.userId}`);
        } else {
            console.log('[Webhook] Received payment_intent.succeeded without order metadata. Skipping order creation.');
        }
        break;

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
        const user = await prisma.user.findUnique({where: {stripeCustomerId: session.customer.toString()}});
        
        if(user){
            await prisma.subscription.upsert({
                where: { userId: user.id },
                update: {
                    status: subscription.status,
                    stripeSubscriptionId: subscription.id,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
                create: {
                    userId: user.id,
                    planId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    stripeSubscriptionId: subscription.id,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                }
            });
            console.log(`[Webhook] Successfully created/updated subscription for user ${user.id}`);
        }
      }
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionUpdated.id },
        data: {
          status: subscriptionUpdated.status,
          currentPeriodEnd: new Date(subscriptionUpdated.current_period_end * 1000),
        },
      });
      break;
    
    default:
      console.log(`[Webhook] Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};