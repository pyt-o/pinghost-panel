import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import * as db from "../db"; // Import db helpers

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getStats: publicProcedure.query(async () => {
    return await db.getSystemStats();
  }),

  getAdvancedStats: adminProcedure.query(async () => {
    // Mock implementation for advanced stats
    const totalRevenue = 12345.67; // PLN
    const avgUptime = 99.95; // %
    const usedDisk = 512000; // MB
    const newUsersLastWeek = 15;
    
    return {
      totalRevenue,
      avgUptime,
      usedDisk,
      newUsersLastWeek,
    };
  }),
});
