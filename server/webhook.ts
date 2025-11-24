import express from 'express';
import { stripe } from './stripe';
import { ENV } from './_core/env';
import * as db from './db';

export function setupStripeWebhook(app: express.Application) {
  // CRITICAL: Register webhook route BEFORE express.json() middleware
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      console.error('[Webhook] No signature provided');
      return res.status(400).send('No signature');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        ENV.stripeWebhookSecret
      );
    } catch (err: any) {
      console.error('[Webhook] Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('[Webhook] Received event:', event.type, event.id);

    // CRITICAL: Handle test events
    if (event.id.startsWith('evt_test_')) {
      console.log('[Webhook] Test event detected, returning verification response');
      return res.json({ verified: true });
    }

    // Handle different event types
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          console.log('[Webhook] Checkout session completed:', session.id);

          const userId = parseInt(session.metadata?.user_id || '0');
          const credits = parseInt(session.metadata?.credits || '0');
          const paymentIntentId = session.payment_intent as string;

          if (userId && credits) {
            // Get current user balance
            const user = await db.getUserById(userId);
            if (user) {
              const balanceBefore = user.credits;
              const balanceAfter = balanceBefore + credits;

              // Add credits to user
              await db.updateUserCredits(userId, balanceAfter);

              // Create credit transaction
              await db.createCreditTransaction({
                userId,
                amount: credits,
                type: 'purchase',
                description: `Purchased ${credits} credits via Stripe`,
                balanceBefore,
                balanceAfter,
              });

              // Update payment record
              const payments = await db.getPaymentsByUserId(userId);
              const payment = payments.find(p => p.stripePaymentIntentId === paymentIntentId);
              if (payment) {
                await db.updatePayment(payment.id, { status: 'completed' });
              }

              console.log(`[Webhook] Added ${credits} credits to user ${userId}`);
            }
          }
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as any;
          console.log('[Webhook] Payment intent succeeded:', paymentIntent.id);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as any;
          console.log('[Webhook] Payment intent failed:', paymentIntent.id);
          
          // Update payment record to failed
          const payments = await db.getAllPayments();
          const payment = payments.find(p => p.stripePaymentIntentId === paymentIntent.id);
          if (payment) {
            await db.updatePayment(payment.id, { status: 'failed' });
          }
          break;
        }

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('[Webhook] Error processing event:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
}
