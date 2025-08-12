import Stripe from 'stripe';
import { config } from '../config';

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const paymentService = {
  createStripeCustomer: async (user: { email: string; name?: string | null }) => {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
    });
    return customer;
  },

  createCheckoutSessionForSubscription: async (customerId: string, priceId: string) => {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${config.frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/pricing`,
    });
    return session;
  },

  createCheckoutSessionForOneTimePurchase: async (priceInCents: number, productName: string) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: productName },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${config.frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/`,
    });
    return session;
  },
};