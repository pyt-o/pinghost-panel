import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: AuthenticatedUser): TrpcContext {
  const ctx: TrpcContext = {
    user: user || null,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return ctx;
}

function createAdminUser(): AuthenticatedUser {
  return {
    id: 1,
    openId: "admin-test",
    email: "admin@test.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    credits: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function createRegularUser(): AuthenticatedUser {
  return {
    id: 2,
    openId: "user-test",
    email: "user@test.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    credits: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("Auth Router", () => {
  it("should return null for unauthenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("should return user data for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toEqual(user);
  });

  it("should logout successfully", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});

describe("Stats Router", () => {
  it("should return user dashboard stats for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stats.userDashboard();
    
    expect(result).toHaveProperty("totalServers");
    expect(result).toHaveProperty("runningServers");
    expect(result).toHaveProperty("credits");
    expect(result).toHaveProperty("openTickets");
    expect(typeof result.totalServers).toBe("number");
  });

  it("should return system stats for admin", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stats.system();
    
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("totalServers");
    expect(result).toHaveProperty("totalNodes");
    expect(result).toHaveProperty("activeServers");
    expect(result).toHaveProperty("openTickets");
  });

  it("should deny system stats for regular user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.stats.system()).rejects.toThrow();
  });
});

describe("Users Router", () => {
  it("should return user credits for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.users.myCredits();
    
    expect(result).toHaveProperty("credits");
    expect(typeof result.credits).toBe("number");
  });

  it("should return credit history for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.users.myCreditHistory();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to list all users", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.users.list();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should deny regular user from listing all users", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.users.list()).rejects.toThrow();
  });
});

describe("Packages Router", () => {
  it("should return active packages for any user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.packages.list();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to list all packages", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.packages.listAll();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Servers Router", () => {
  it("should return user's servers for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.servers.list();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to see all servers", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.servers.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Tickets Router", () => {
  it("should return user's tickets for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tickets.list();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to see all tickets", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tickets.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Payment Router", () => {
  it("should return available credit packages", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.payment.packages();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("credits");
    expect(result[0]).toHaveProperty("price");
  });

  it("should return payment history for authenticated user", async () => {
    const user = createRegularUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.payment.history();
    
    expect(Array.isArray(result)).toBe(true);
  });
});
