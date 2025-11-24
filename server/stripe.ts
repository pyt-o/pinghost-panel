import Stripe from 'stripe';
import { ENV } from './_core/env';

if (!ENV.stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

export const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

export async function createCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  credits: number;
  amount: number;
  origin: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${params.credits} Credits`,
            description: `Add ${params.credits} credits to your account`,
          },
          unit_amount: Math.round(params.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${params.origin}/credits?success=true`,
    cancel_url: `${params.origin}/credits?canceled=true`,
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
      credits: params.credits.toString(),
    },
    allow_promotion_codes: true,
  });

  return session;
}
