import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { authenticator } from 'otplib';

// Mock library for 2FA setup
// In a real application, you would use a library like 'otplib'
// For now, we will mock the secret generation and verification

const generateSecret = (userId: string) => {
  // In a real app: authenticator.generateSecret();
  return `MOCK_SECRET_${userId}`;
};

const verifyToken = (secret: string, token: string) => {
  // In a real app: authenticator.verify({ secret, token });
  return token === '123456'; // Mock verification
};

export const twoFactorAuthRouter = router({
  twoFactorAuth: router({
    generate: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.user.id.toString();
      const existingSecret = await db.get2FASecretByUserId(userId);
      
      if (existingSecret) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: '2FA is already enabled' });
      }
      
      const secret = generateSecret(userId);
      const otpauth = authenticator.keyuri('PingHost', ctx.user.email || `user_${userId}@pinghost.com`, secret);
      
      // Store the secret temporarily until the user confirms with a token
      // For this mock, we will just return it, in a real app, you'd use a temporary table or session
      
      return { secret, otpauth };
    }),
    
    enable: protectedProcedure
      .input(z.object({ secret: z.string(), token: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user.id.toString();
        
        if (!verifyToken(input.secret, input.token)) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid 2FA token' });
        }
        
        // In a real app, you would verify the secret is the one generated in the 'generate' step
        // and then save it permanently.
        await db.create2FASecret(userId, input.secret);
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'user.2fa.enable',
          details: JSON.stringify({ userId: ctx.user.id }),
        });
        
        return { success: true };
      }),
      
    disable: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user.id.toString();
        const existingSecret = await db.get2FASecretByUserId(userId);
        
        if (!existingSecret) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: '2FA is not enabled' });
        }
        
        if (!verifyToken(existingSecret.secret, input.token)) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid 2FA token' });
        }
        
        await db.delete2FASecret(userId);
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'user.2fa.disable',
          details: JSON.stringify({ userId: ctx.user.id }),
        });
        
        return { success: true };
      }),
      
    status: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id.toString();
      const existingSecret = await db.get2FASecretByUserId(userId);
      return { enabled: !!existingSecret };
    }),
  }),
});
