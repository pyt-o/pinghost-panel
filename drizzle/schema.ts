import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, serial } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  language: varchar("language", { length: 5 }).default("pl").notNull(), // Language preference: pl, en
  credits: int("credits").default(0).notNull(), // Virtual currency for services
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Nodes - Physical/Virtual servers that host game servers
 */
export const nodes = mysqlTable("nodes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), // e.g., "Warsaw, Poland"
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
  port: int("port").default(2022).notNull(),
  // Resource limits
  totalRam: int("totalRam").notNull(), // MB
  totalDisk: int("totalDisk").notNull(), // MB
  totalCpu: int("totalCpu").notNull(), // CPU cores * 100
  // Current usage
  usedRam: int("usedRam").default(0).notNull(),
  usedDisk: int("usedDisk").default(0).notNull(),
  usedCpu: int("usedCpu").default(0).notNull(),
  // Status
  status: mysqlEnum("status", ["online", "offline", "maintenance"]).default("online").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(), // Can users create servers on this node?
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Node = typeof nodes.$inferSelect;
export type InsertNode = typeof nodes.$inferInsert;

/**
 * Server packages - Predefined server configurations
 */
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // Resources
  ram: int("ram").notNull(), // MB
  disk: int("disk").notNull(), // MB
  cpu: int("cpu").notNull(), // CPU percentage (100 = 1 core)
  databases: int("databases").default(0).notNull(),
  backups: int("backups").default(0).notNull(),
  // Pricing
  pricePerHour: int("pricePerHour").notNull(), // Credits per hour
  pricePerDay: int("pricePerDay").notNull(), // Credits per day
  pricePerMonth: int("pricePerMonth").notNull(), // Credits per month
  // Availability
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

/**
 * Servers - Game/application servers created by users
 */
export const servers = mysqlTable("servers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nodeId: int("nodeId").notNull(),
  packageId: int("packageId").notNull(),
  // Server details
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  serverType: varchar("serverType", { length: 100 }).notNull(), // e.g., "minecraft", "csgo", "nodejs"
  // Docker container info
  containerId: varchar("containerId", { length: 255 }),
  imageTag: varchar("imageTag", { length: 255 }).notNull(), // Docker image
  // Network
  ipAddress: varchar("ipAddress", { length: 45 }),
  port: int("port"),
  // Resources (copied from package at creation)
  allocatedRam: int("allocatedRam").notNull(),
  allocatedDisk: int("allocatedDisk").notNull(),
  allocatedCpu: int("allocatedCpu").notNull(),
  // Status
  status: mysqlEnum("status", ["installing", "running", "stopped", "suspended", "error"]).default("stopped").notNull(),
  autoStart: boolean("autoStart").default(false).notNull(),
  // Billing
  billingCycle: mysqlEnum("billingCycle", ["hourly", "daily", "monthly"]).default("monthly").notNull(),
  lastBilledAt: timestamp("lastBilledAt"),
  expiresAt: timestamp("expiresAt"),
  autoRenew: boolean("auto_renew").default(false).notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Server = typeof servers.$inferSelect;
export type InsertServer = typeof servers.$inferInsert;

/**
 * Server databases - MySQL/PostgreSQL databases for servers
 */
export const serverDatabases = mysqlTable("serverDatabases", {
  id: int("id").autoincrement().primaryKey(),
  serverId: int("serverId").notNull(),
  databaseName: varchar("databaseName", { length: 255 }).notNull(),
  databaseType: mysqlEnum("databaseType", ["mysql", "postgresql"]).default("mysql").notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  host: varchar("host", { length: 255 }).notNull(),
  port: int("port").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServerDatabase = typeof serverDatabases.$inferSelect;
export type InsertServerDatabase = typeof serverDatabases.$inferInsert;

/**
 * Credit transactions - History of credit purchases and usage
 */
export const creditTransactions = mysqlTable("creditTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // Positive for purchase, negative for usage
  type: mysqlEnum("type", ["purchase", "usage", "refund", "bonus", "admin_adjustment"]).notNull(),
  description: text("description"),
  relatedServerId: int("relatedServerId"), // If transaction is related to a server
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

/**
 * Payments - Stripe payment records
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  amount: int("amount").notNull(), // Amount in smallest currency unit (cents)
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  creditsAmount: int("creditsAmount").notNull(), // Credits purchased
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Support tickets
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting_user", "closed"]).default("open").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "technical", "billing", "general"
  relatedServerId: int("relatedServerId"), // Optional link to server
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Ticket messages - Conversation in support tickets
 */
export const ticketMessages = mysqlTable("ticketMessages", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  isStaffReply: boolean("isStaffReply").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

/**
 * Activity logs - Audit trail for important actions
 */
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "server.create", "user.login", "credits.purchase"
  details: text("details"), // JSON string with additional info
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Eggs - Server templates/configurations
 */
export const eggs = mysqlTable("eggs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  author: varchar("author", { length: 255 }),
  dockerImage: varchar("dockerImage", { length: 255 }).notNull(),
  startupCommand: text("startupCommand").notNull(),
  configFiles: text("configFiles"), // JSON array of config file templates
  category: varchar("category", { length: 100 }).notNull(), // e.g., "minecraft", "csgo", "nodejs", "python"
  icon: varchar("icon", { length: 255 }), // URL to icon image
  minRam: int("minRam").default(512).notNull(), // Minimum RAM in MB
  minDisk: int("minDisk").default(1024).notNull(), // Minimum disk in MB
  minCpu: int("minCpu").default(50).notNull(), // Minimum CPU percentage
  isActive: boolean("isActive").default(true).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Egg = typeof eggs.$inferSelect;
export type InsertEgg = typeof eggs.$inferInsert;

/**
 * Marketplace items - Plugins, mods, addons
 */
export const marketplaceItems = mysqlTable("marketplaceItems", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "plugin", "mod", "theme", "script"
  serverType: varchar("serverType", { length: 100 }).notNull(), // Compatible server type
  version: varchar("version", { length: 50 }).notNull(),
  downloadUrl: text("downloadUrl").notNull(),
  installScript: text("installScript"), // Script to install the item
  icon: varchar("icon", { length: 255 }), // URL to icon image
  price: int("price").default(0).notNull(), // Credits required (0 = free)
  isActive: boolean("isActive").default(true).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"), // Average rating 0.00-5.00
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceItem = typeof marketplaceItems.$inferSelect;
export type InsertMarketplaceItem = typeof marketplaceItems.$inferInsert;

/**
 * Server installed items - Tracking what's installed on each server
 */
export const serverInstalledItems = mysqlTable("serverInstalledItems", {
  id: int("id").autoincrement().primaryKey(),
  serverId: int("serverId").notNull(),
  marketplaceItemId: int("marketplaceItemId").notNull(),
  installedAt: timestamp("installedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["installing", "installed", "failed", "uninstalled"]).default("installing").notNull(),
});

export type ServerInstalledItem = typeof serverInstalledItems.$inferSelect;
export type InsertServerInstalledItem = typeof serverInstalledItems.$inferInsert;

/**
 * Chat messages - AI chatbot history
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;


/**
 * Backups - Server backups
 */
export const backups = mysqlTable("backups", {
  id: int("id").autoincrement().primaryKey(),
  serverId: int("serverId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  size: int("size").notNull(), // Size in bytes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("completed").notNull(),
});

export type Backup = typeof backups.$inferSelect;
export type InsertBackup = typeof backups.$inferInsert;


// 2FA
export const twoFactorSecrets = mysqlTable('two_factor_secrets', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  secret: text('secret').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Marketplace Reviews
export const marketplaceReviews = mysqlTable('marketplace_reviews', {
  id: serial('id').primaryKey(),
  itemId: int('item_id').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  rating: int('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});
