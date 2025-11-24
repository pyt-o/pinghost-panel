import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { paymentRouter } from "./payment-router";

// Admin-only middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  payment: paymentRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== USERS ====================
  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getUserById(input.id);
      }),
    
    updateCredits: adminProcedure
      .input(z.object({ 
        userId: z.number(), 
        credits: z.number(),
        reason: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserById(input.userId);
        if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        
        const balanceBefore = user.credits;
        const balanceAfter = input.credits;
        const amount = balanceAfter - balanceBefore;
        
        await db.updateUserCredits(input.userId, input.credits);
        await db.createCreditTransaction({
          userId: input.userId,
          amount,
          type: 'admin_adjustment',
          description: input.reason || 'Admin adjustment',
          balanceBefore,
          balanceAfter,
        });
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'user.credits.update',
          details: JSON.stringify({ targetUserId: input.userId, amount, reason: input.reason }),
        });
        
        return { success: true };
      }),
    
    updateRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(['user', 'admin']) }))
      .mutation(async ({ input, ctx }) => {
        await db.updateUserRole(input.userId, input.role);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'user.role.update',
          details: JSON.stringify({ targetUserId: input.userId, newRole: input.role }),
        });
        return { success: true };
      }),
    
    myCredits: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return { credits: user?.credits || 0 };
    }),
    
    myCreditHistory: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCreditTransactionsByUserId(ctx.user.id);
    }),
  }),

  // ==================== NODES ====================
  nodes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin') {
        return await db.getAllNodes();
      }
      return await db.getPublicNodes();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNodeById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        location: z.string(),
        ipAddress: z.string(),
        port: z.number().default(2022),
        totalRam: z.number(),
        totalDisk: z.number(),
        totalCpu: z.number(),
        isPublic: z.boolean().default(true),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNode(input);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'node.create',
          details: JSON.stringify({ name: input.name, location: input.location }),
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        ipAddress: z.string().optional(),
        port: z.number().optional(),
        totalRam: z.number().optional(),
        totalDisk: z.number().optional(),
        totalCpu: z.number().optional(),
        status: z.enum(['online', 'offline', 'maintenance']).optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await db.updateNode(id, data);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'node.update',
          details: JSON.stringify({ nodeId: id, changes: data }),
        });
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const servers = await db.getServersByNodeId(input.id);
        if (servers.length > 0) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `Cannot delete node with ${servers.length} active servers` 
          });
        }
        await db.deleteNode(input.id);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'node.delete',
          details: JSON.stringify({ nodeId: input.id }),
        });
        return { success: true };
      }),
  }),

  // ==================== PACKAGES ====================
  packages: router({
    list: publicProcedure.query(async () => {
      return await db.getActivePackages();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllPackages();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPackageById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        ram: z.number(),
        disk: z.number(),
        cpu: z.number(),
        databases: z.number().default(0),
        backups: z.number().default(0),
        pricePerHour: z.number(),
        pricePerDay: z.number(),
        pricePerMonth: z.number(),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPackage(input);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'package.create',
          details: JSON.stringify({ name: input.name }),
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        ram: z.number().optional(),
        disk: z.number().optional(),
        cpu: z.number().optional(),
        databases: z.number().optional(),
        backups: z.number().optional(),
        pricePerHour: z.number().optional(),
        pricePerDay: z.number().optional(),
        pricePerMonth: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await db.updatePackage(id, data);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'package.update',
          details: JSON.stringify({ packageId: id, changes: data }),
        });
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deletePackage(input.id);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'package.delete',
          details: JSON.stringify({ packageId: input.id }),
        });
        return { success: true };
      }),
  }),

  // ==================== SERVERS ====================
  servers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin') {
        return await db.getAllServers();
      }
      return await db.getServersByUserId(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const server = await db.getServerById(input.id);
        if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
        
        if (ctx.user.role !== 'admin' && server.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        return server;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        nodeId: z.number(),
        packageId: z.number(),
        serverType: z.string(),
        imageTag: z.string(),
        billingCycle: z.enum(['hourly', 'daily', 'monthly']).default('monthly'),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserById(ctx.user.id);
        const pkg = await db.getPackageById(input.packageId);
        const node = await db.getNodeById(input.nodeId);
        
        if (!pkg) throw new TRPCError({ code: 'NOT_FOUND', message: 'Package not found' });
        if (!node) throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' });
        
        // Check if node has enough resources
        const availableRam = node.totalRam - node.usedRam;
        const availableDisk = node.totalDisk - node.usedDisk;
        const availableCpu = node.totalCpu - node.usedCpu;
        
        if (availableRam < pkg.ram || availableDisk < pkg.disk || availableCpu < pkg.cpu) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Node does not have enough resources' });
        }
        
        // Calculate initial billing
        let price = 0;
        if (input.billingCycle === 'hourly') price = pkg.pricePerHour;
        else if (input.billingCycle === 'daily') price = pkg.pricePerDay;
        else price = pkg.pricePerMonth;
        
        if (!user || user.credits < price) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient credits' });
        }
        
        // Create server
        const now = new Date();
        let expiresAt = new Date();
        if (input.billingCycle === 'hourly') expiresAt.setHours(expiresAt.getHours() + 1);
        else if (input.billingCycle === 'daily') expiresAt.setDate(expiresAt.getDate() + 1);
        else expiresAt.setMonth(expiresAt.getMonth() + 1);
        
        await db.createServer({
          userId: ctx.user.id,
          nodeId: input.nodeId,
          packageId: input.packageId,
          name: input.name,
          description: input.description,
          serverType: input.serverType,
          imageTag: input.imageTag,
          allocatedRam: pkg.ram,
          allocatedDisk: pkg.disk,
          allocatedCpu: pkg.cpu,
          billingCycle: input.billingCycle,
          status: 'installing',
          lastBilledAt: now,
          expiresAt,
        });
        
        // Deduct credits
        const newCredits = user.credits - price;
        await db.updateUserCredits(ctx.user.id, newCredits);
        await db.createCreditTransaction({
          userId: ctx.user.id,
          amount: -price,
          type: 'usage',
          description: `Server creation: ${input.name}`,
          balanceBefore: user.credits,
          balanceAfter: newCredits,
        });
        
        // Update node resources
        await db.updateNodeResources(
          input.nodeId,
          node.usedRam + pkg.ram,
          node.usedDisk + pkg.disk,
          node.usedCpu + pkg.cpu
        );
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'server.create',
          details: JSON.stringify({ name: input.name, nodeId: input.nodeId }),
        });
        
        return { success: true };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        action: z.enum(['start', 'stop', 'restart', 'reinstall']),
      }))
      .mutation(async ({ input, ctx }) => {
        const server = await db.getServerById(input.id);
        if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
        
        if (ctx.user.role !== 'admin' && server.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        let newStatus: typeof server.status = server.status;
        if (input.action === 'start') newStatus = 'running';
        else if (input.action === 'stop') newStatus = 'stopped';
        else if (input.action === 'restart') newStatus = 'running';
        else if (input.action === 'reinstall') newStatus = 'installing';
        
        await db.updateServer(input.id, { status: newStatus });
        await db.createActivityLog({
          userId: ctx.user.id,
          action: `server.${input.action}`,
          details: JSON.stringify({ serverId: input.id }),
        });
        
        return { success: true, status: newStatus };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const server = await db.getServerById(input.id);
        if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
        
        if (ctx.user.role !== 'admin' && server.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        const node = await db.getNodeById(server.nodeId);
        if (node) {
          await db.updateNodeResources(
            server.nodeId,
            Math.max(0, node.usedRam - server.allocatedRam),
            Math.max(0, node.usedDisk - server.allocatedDisk),
            Math.max(0, node.usedCpu - server.allocatedCpu)
          );
        }
        
        await db.deleteServer(input.id);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'server.delete',
          details: JSON.stringify({ serverId: input.id }),
        });
        
        return { success: true };
      }),
  }),

  // ==================== TICKETS ====================
  tickets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin') {
        return await db.getAllTickets();
      }
      return await db.getTicketsByUserId(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const ticket = await db.getTicketById(input.id);
        if (!ticket) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' });
        
        if (ctx.user.role !== 'admin' && ticket.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        const messages = await db.getTicketMessagesByTicketId(input.id);
        return { ticket, messages };
      }),
    
    create: protectedProcedure
      .input(z.object({
        subject: z.string(),
        message: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
        category: z.string(),
        relatedServerId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createTicket({
          userId: ctx.user.id,
          subject: input.subject,
          priority: input.priority,
          category: input.category,
          relatedServerId: input.relatedServerId,
          status: 'open',
        });
        
        // Get the newly created ticket ID
        const tickets = await db.getTicketsByUserId(ctx.user.id);
        const ticketId = tickets[0]?.id || 0;
        
        await db.createTicketMessage({
          ticketId,
          userId: ctx.user.id,
          message: input.message,
          isStaffReply: false,
        });
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'ticket.create',
          details: JSON.stringify({ ticketId, subject: input.subject }),
        });
        
        return { success: true, ticketId };
      }),
    
    reply: protectedProcedure
      .input(z.object({
        ticketId: z.number(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ticket = await db.getTicketById(input.ticketId);
        if (!ticket) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' });
        
        if (ctx.user.role !== 'admin' && ticket.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        await db.createTicketMessage({
          ticketId: input.ticketId,
          userId: ctx.user.id,
          message: input.message,
          isStaffReply: ctx.user.role === 'admin',
        });
        
        if (ctx.user.role === 'admin' && ticket.status === 'waiting_user') {
          await db.updateTicket(input.ticketId, { status: 'in_progress' });
        } else if (ctx.user.role !== 'admin' && ticket.status === 'in_progress') {
          await db.updateTicket(input.ticketId, { status: 'waiting_user' });
        }
        
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'ticket.reply',
          details: JSON.stringify({ ticketId: input.ticketId }),
        });
        
        return { success: true };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        ticketId: z.number(),
        status: z.enum(['open', 'in_progress', 'waiting_user', 'closed']),
      }))
      .mutation(async ({ input, ctx }) => {
        const ticket = await db.getTicketById(input.ticketId);
        if (!ticket) throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' });
        
        if (ctx.user.role !== 'admin' && ticket.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        const updateData: any = { status: input.status };
        if (input.status === 'closed') {
          updateData.closedAt = new Date();
        }
        
        await db.updateTicket(input.ticketId, updateData);
        await db.createActivityLog({
          userId: ctx.user.id,
          action: 'ticket.status.update',
          details: JSON.stringify({ ticketId: input.ticketId, newStatus: input.status }),
        });
        
        return { success: true };
      }),
  }),

  // ==================== STATISTICS ====================
  stats: router({
    system: adminProcedure.query(async () => {
      return await db.getSystemStats();
    }),
    
    userDashboard: protectedProcedure.query(async ({ ctx }) => {
      const servers = await db.getServersByUserId(ctx.user.id);
      const user = await db.getUserById(ctx.user.id);
      const tickets = await db.getTicketsByUserId(ctx.user.id);
      
      const runningServers = servers.filter(s => s.status === 'running').length;
      const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
      
      return {
        totalServers: servers.length,
        runningServers,
        credits: user?.credits || 0,
        openTickets,
      };
    }),
  }),

  // ==================== ACTIVITY LOGS ====================
  logs: router({
    myActivity: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input, ctx }) => {
        return await db.getActivityLogsByUserId(ctx.user.id, input.limit);
      }),
    
    allActivity: adminProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await db.getAllActivityLogs(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
