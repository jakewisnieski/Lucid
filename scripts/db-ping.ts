// Verifies the Neon connection named by DATABASE_URL with a trivial query.
// Run: `npm run db:ping` (requires DATABASE_URL in .env). No schema/models needed.
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("db:ping ok — connected to DATABASE_URL");
  } catch (err) {
    console.error(
      "db:ping failed:",
      err instanceof Error ? err.message : String(err),
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
