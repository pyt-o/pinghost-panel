import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const marketplaceReviewRouter = router({
  marketplaceReviews: router({
    submit: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().max(500).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const item = await db.getMarketplaceItemById(input.itemId);
        if (!item) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Marketplace item not found' });
        }
        
        const existingReview = await db.getMarketplaceReviewByItemAndUser(input.itemId, ctx.user.id.toString());
        if (existingReview) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'You have already reviewed this item' });
        }
        
        await db.createMarketplaceReview({
          itemId: input.itemId,
          userId: ctx.user.id.toString(),
          rating: input.rating,
          comment: input.comment,
        });
        
        // Update item's average rating
        await db.updateMarketplaceItemRating(input.itemId);
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'marketplace.review.submit',
          details: JSON.stringify({ itemId: input.itemId, rating: input.rating }),
        });
        
        return { success: true };
      }),
      
    listByItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMarketplaceReviewsByItemId(input.itemId);
      }),
  }),
});
