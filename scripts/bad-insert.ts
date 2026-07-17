// try:bad-insert — proves the owner_id seam and the item tree are enforced by
// the database, not just by app convention. It attempts two rows the DB must
// reject with a foreign-key error (Prisma code P2003):
//
//   A. an Item whose owner_id points at no User  (the owner_id seam)
//   B. an Item whose parent_id points at no Item  (the self-referential tree)
//
// Exits 0 only if BOTH are rejected; exits 1 (loudly) if the DB let either
// through. A temporary backlog is created for context and torn down at the end.
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { ensureLocalUser } from "../src/lib/db/local-user";

function isForeignKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err &&
    (err as { code?: string }).code === "P2003";
}

async function expectRejected(
  label: string,
  attempt: () => Promise<unknown>,
): Promise<boolean> {
  try {
    await attempt();
    console.error(`  ✗ ${label}: row was INSERTED — constraint missing!`);
    return false;
  } catch (err) {
    if (isForeignKeyError(err)) {
      console.log(`  ✓ ${label}: rejected by a foreign-key constraint (P2003)`);
      return true;
    }
    throw err;
  }
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const owner = await ensureLocalUser(prisma);
    const backlog = await prisma.backlog.create({
      data: { ownerId: owner.id, title: "try:bad-insert scratch" },
    });
    try {
      const badOwner = await expectRejected(
        "owner_id -> no User",
        () =>
          prisma.item.create({
            data: { ownerId: randomUUID(), backlogId: backlog.id, type: "story" },
          }),
      );
      const badParent = await expectRejected(
        "parent_id -> no Item",
        () =>
          prisma.item.create({
            data: {
              ownerId: owner.id,
              backlogId: backlog.id,
              type: "story",
              parentId: randomUUID(),
            },
          }),
      );
      if (badOwner && badParent) {
        console.log("try:bad-insert ok — both bad rows were rejected");
      } else {
        process.exitCode = 1;
      }
    } finally {
      // Cascade cleans up anything that unexpectedly slipped through.
      await prisma.backlog.delete({ where: { id: backlog.id } });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(
    "try:bad-insert failed:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
