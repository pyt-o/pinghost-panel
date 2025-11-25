import { eq, desc, and, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  nodes, InsertNode,
  packages, InsertPackage,
  servers, InsertServer,
  serverDatabases, InsertServerDatabase,
  creditTransactions, InsertCreditTransaction,
  payments, InsertPayment,
  tickets, InsertTicket,
  ticketMessages, InsertTicketMessage,
  activityLogs, InsertActivityLog,
  eggs, InsertEgg,
  marketplaceItems, InsertMarketplaceItem,
  serverInstalledItems, InsertServerInstalledItem,
  chatMessages, InsertChatMessage,
  twoFactorSecrets,
  marketplaceReviews,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USERS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserCredits(userId: number, newCredits: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ credits: newCredits }).where(eq(users.id, userId));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ==================== NODES ====================

export async function createNode(node: InsertNode) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(nodes).values(node);
  return result;
}

export async function getAllNodes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(nodes).orderBy(desc(nodes.createdAt));
}

export async function getNodeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(nodes).where(eq(nodes.id, id)).limit(1);
  return result[0];
}

export async function getPublicNodes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(nodes).where(eq(nodes.isPublic, true));
}

export async function updateNode(id: number, data: Partial<InsertNode>) {
  const db = await getDb();
  if (!db) return;
  await db.update(nodes).set(data).where(eq(nodes.id, id));
}

export async function deleteNode(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(nodes).where(eq(nodes.id, id));
}

export async function updateNodeResources(nodeId: number, usedRam: number, usedDisk: number, usedCpu: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(nodes).set({ usedRam, usedDisk, usedCpu }).where(eq(nodes.id, nodeId));
}

// ==================== PACKAGES ====================

export async function createPackage(pkg: InsertPackage) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(packages).values(pkg);
  return result;
}

export async function getAllPackages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(packages).orderBy(desc(packages.createdAt));
}

export async function getActivePackages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(packages).where(eq(packages.isActive, true));
}

export async function getPackageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result[0];
}

export async function updatePackage(id: number, data: Partial<InsertPackage>) {
  const db = await getDb();
  if (!db) return;
  await db.update(packages).set(data).where(eq(packages.id, id));
}

export async function deletePackage(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(packages).where(eq(packages.id, id));
}

// ==================== SERVERS ====================

export async function createServer(server: InsertServer) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(servers).values(server);
  return result;
}

export async function getAllServers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servers).orderBy(desc(servers.createdAt));
}

export async function getServersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servers).where(eq(servers.userId, userId)).orderBy(desc(servers.createdAt));
}

export async function getServerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(servers).where(eq(servers.id, id)).limit(1);
  return result[0];
}

export async function updateServer(id: number, data: Partial<InsertServer>) {
  const db = await getDb();
  if (!db) return;
  await db.update(servers).set(data).where(eq(servers.id, id));
}

export async function deleteServer(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(servers).where(eq(servers.id, id));
}

export async function getServersByNodeId(nodeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servers).where(eq(servers.nodeId, nodeId));
}

// ==================== SERVER DATABASES ====================

export async function createServerDatabase(database: InsertServerDatabase) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(serverDatabases).values(database);
  return result;
}

export async function getServerDatabasesByServerId(serverId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(serverDatabases).where(eq(serverDatabases.serverId, serverId));
}

export async function deleteServerDatabase(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(serverDatabases).where(eq(serverDatabases.id, id));
}

// ==================== CREDIT TRANSACTIONS ====================

export async function createCreditTransaction(transaction: InsertCreditTransaction) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(creditTransactions).values(transaction);
  return result;
}

export async function getCreditTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(desc(creditTransactions.createdAt));
}

export async function getAllCreditTransactions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(creditTransactions).orderBy(desc(creditTransactions.createdAt));
}

// ==================== PAYMENTS ====================

export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getPaymentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function updatePayment(id: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) return;
  await db.update(payments).set(data).where(eq(payments.id, id));
}

// ==================== TICKETS ====================

export async function createTicket(ticket: InsertTicket) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(tickets).values(ticket);
  return result;
}

export async function getAllTickets() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
}

export async function getTicketsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
}

export async function getTicketById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  return result[0];
}

export async function updateTicket(id: number, data: Partial<InsertTicket>) {
  const db = await getDb();
  if (!db) return;
  await db.update(tickets).set(data).where(eq(tickets.id, id));
}

// ==================== TICKET MESSAGES ====================

export async function createTicketMessage(message: InsertTicketMessage) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(ticketMessages).values(message);
  return result;
}

export async function getTicketMessagesByTicketId(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
}

// ==================== ACTIVITY LOGS ====================

export async function createActivityLog(log: InsertActivityLog) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(activityLogs).values(log);
  return result;
}

export async function getActivityLogsByUserId(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

export async function getAllActivityLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

// ==================== STATISTICS ====================

export async function getSystemStats() {
  const db = await getDb();
  if (!db) return null;

  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [totalServers] = await db.select({ count: sql<number>`count(*)` }).from(servers);
  const [totalNodes] = await db.select({ count: sql<number>`count(*)` }).from(nodes);
  const [activeServers] = await db.select({ count: sql<number>`count(*)` }).from(servers).where(eq(servers.status, "running"));
  const [openTickets] = await db.select({ count: sql<number>`count(*)` }).from(tickets).where(eq(tickets.status, "open"));

  return {
    totalUsers: totalUsers?.count || 0,
    totalServers: totalServers?.count || 0,
    totalNodes: totalNodes?.count || 0,
    activeServers: activeServers?.count || 0,
    openTickets: openTickets?.count || 0,
  };
}

// ==================== EGGS ====================

export async function getAllEggs() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(eggs).orderBy(desc(eggs.createdAt));
}

export async function getActiveEggs() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(eggs).where(eq(eggs.isActive, true)).orderBy(desc(eggs.downloadCount));
}

export async function getEggById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(eggs).where(eq(eggs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEggsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(eggs).where(and(eq(eggs.category, category), eq(eggs.isActive, true)));
}

export async function createEgg(egg: InsertEgg) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(eggs).values(egg);
}

export async function updateEgg(id: number, data: Partial<InsertEgg>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(eggs).set(data).where(eq(eggs.id, id));
}

export async function deleteEgg(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(eggs).where(eq(eggs.id, id));
}

export async function incrementEggDownloadCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(eggs).set({ downloadCount: sql`${eggs.downloadCount} + 1` }).where(eq(eggs.id, id));
}

// ==================== MARKETPLACE ====================

export async function getAllMarketplaceItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(marketplaceItems).orderBy(desc(marketplaceItems.createdAt));
}

export async function getActiveMarketplaceItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(marketplaceItems).where(eq(marketplaceItems.isActive, true)).orderBy(desc(marketplaceItems.downloadCount));
}

export async function getMarketplaceItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(marketplaceItems).where(eq(marketplaceItems.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getMarketplaceItemsByServerType(serverType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(marketplaceItems).where(
    and(
      or(eq(marketplaceItems.serverType, serverType), eq(marketplaceItems.serverType, "all")),
      eq(marketplaceItems.isActive, true)
    )
  );
}

export async function getMarketplaceItemsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(marketplaceItems).where(and(eq(marketplaceItems.category, category), eq(marketplaceItems.isActive, true)));
}

export async function createMarketplaceItem(item: InsertMarketplaceItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(marketplaceItems).values(item);
}

export async function updateMarketplaceItem(id: number, data: Partial<InsertMarketplaceItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(marketplaceItems).set(data).where(eq(marketplaceItems.id, id));
}

export async function deleteMarketplaceItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(marketplaceItems).where(eq(marketplaceItems.id, id));
}

export async function incrementMarketplaceItemDownloadCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(marketplaceItems).set({ downloadCount: sql`${marketplaceItems.downloadCount} + 1` }).where(eq(marketplaceItems.id, id));
}

// ==================== SERVER INSTALLED ITEMS ====================

export async function getServerInstalledItems(serverId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(serverInstalledItems).where(eq(serverInstalledItems.serverId, serverId));
}

export async function createServerInstalledItem(item: InsertServerInstalledItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(serverInstalledItems).values(item);
}

export async function updateServerInstalledItemStatus(id: number, status: "installing" | "installed" | "failed" | "uninstalled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(serverInstalledItems).set({ status }).where(eq(serverInstalledItems.id, id));
}

export async function deleteServerInstalledItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(serverInstalledItems).where(eq(serverInstalledItems.id, id));
}

// ==================== CHAT MESSAGES ====================

export async function getChatMessagesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt);
}

export async function getChatMessagesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(desc(chatMessages.createdAt));
}

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatMessages).values(message);
}

export async function deleteChatMessagesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
}


// ==================== 2FA ====================

export async function get2FASecretByUserId(userId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(twoFactorSecrets).where(eq(twoFactorSecrets.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function create2FASecret(userId: string, secret: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(twoFactorSecrets).values({ userId, secret });
}

export async function delete2FASecret(userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(twoFactorSecrets).where(eq(twoFactorSecrets.userId, userId));
}

// ==================== MARKETPLACE REVIEWS ====================

export async function createMarketplaceReview(review: { itemId: number, userId: string, rating: number, comment?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(marketplaceReviews).values(review);
}

export async function getMarketplaceReviewsByItemId(itemId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(marketplaceReviews).where(eq(marketplaceReviews.itemId, itemId)).orderBy(desc(marketplaceReviews.createdAt));
}

export async function getMarketplaceReviewByItemAndUser(itemId: number, userId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(marketplaceReviews).where(and(eq(marketplaceReviews.itemId, itemId), eq(marketplaceReviews.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateMarketplaceItemRating(itemId: number) {
  const db = await getDb();
  if (!db) return;

  const [avgRatingResult] = await db.select({
    avgRating: sql<number>`avg(${marketplaceReviews.rating})`,
  }).from(marketplaceReviews).where(eq(marketplaceReviews.itemId, itemId));

  const avgRating = avgRatingResult?.avgRating ? parseFloat(avgRatingResult.avgRating.toFixed(2)) : 0.00;

  await db.update(marketplaceItems).set({ rating: avgRating }).where(eq(marketplaceItems.id, itemId));
}
