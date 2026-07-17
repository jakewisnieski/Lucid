import { PrismaClient } from "@prisma/client";

// A single PrismaClient for the app runtime. Cached on globalThis so Next.js
// dev hot-reloads don't open a new connection pool on every reload. Scripts
// and tests create their own client instead (they own the connection
// lifecycle and call $disconnect explicitly).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
