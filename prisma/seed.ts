// db:seed — creates exactly one local owner (idempotent). Run via
// `npm run db:seed` (which invokes `prisma db seed`, configured in package.json).
import { PrismaClient } from "@prisma/client";
import { ensureLocalUser } from "../src/lib/db/local-user";

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await ensureLocalUser(prisma);
    console.log(`db:seed ok — local owner ${user.email} (${user.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("db:seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
