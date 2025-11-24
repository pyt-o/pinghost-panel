import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createCheckoutSession } from "./stripe";
import { CREDIT_PACKAGES } from "./products";
import * as db from "./db";

export const paymentRouter = router({
  // Get available credit packages
  packages: protectedProcedure.query(() => {
    return CREDIT_PACKAGES;
  }),

  // Create Stripe checkout session
  createCheckout: protectedProcedure
    .input(z.object({
      packageId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const pkg = CREDIT_PACKAGES.find(p => p.id === input.packageId);
      if (!pkg) {
        throw new Error('Invalid package');
      }

      const origin = ctx.req.headers.origin || 'http://localhost:3000';
      
      const session = await createCheckoutSession({
        userId: ctx.user.id,
        userEmail: ctx.user.email || '',
        userName: ctx.user.name || 'User',
        credits: pkg.credits,
        amount: pkg.price,
        origin,
      });

      // Create pending payment record
      await db.createPayment({
        userId: ctx.user.id,
        stripePaymentIntentId: session.payment_intent as string || null,
        amount: Math.round(pkg.price * 100),
        currency: 'USD',
        creditsAmount: pkg.credits,
        status: 'pending',
      });

      await db.createActivityLog({
        userId: ctx.user.id,
        action: 'payment.checkout.created',
        details: JSON.stringify({ packageId: input.packageId, credits: pkg.credits }),
      });

      return { url: session.url };
    }),

  // Get payment history
  history: protectedProcedure.query(async ({ ctx }) => {
    return await db.getPaymentsByUserId(ctx.user.id);
  }),
});
