import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { seedSampleBacklog, type SampleBacklog } from "../src/lib/db/sample";

// Integration tests: they need a real Postgres (DATABASE_URL). CI provisions an
// ephemeral one and runs `prisma migrate deploy` before `npm test`; locally
// they run against the .env database. Skipped (not failed) when no DB is
// configured, so `npm test` still works on a bare checkout.
const describeDb = process.env.DATABASE_URL ? describe : describe.skip;

describeDb("schema relations", () => {
  const prisma = new PrismaClient();
  // A throwaway owner scopes every row this suite writes; deleting it in
  // afterAll cascades the whole graph away, so the suite leaves no residue.
  const ownerId = randomUUID();
  let sample: SampleBacklog;

  beforeAll(async () => {
    await prisma.user.create({
      data: { id: ownerId, ownerId, email: `test-${ownerId}@lucid.test` },
    });
    sample = await seedSampleBacklog(prisma, ownerId);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: ownerId } });
    await prisma.$disconnect();
  });

  it("stores the item tree via the self-referential parent/child relation", async () => {
    const epic = await prisma.item.findUniqueOrThrow({
      where: { id: sample.epicId },
      include: { children: true },
    });
    expect(epic.parentId).toBeNull();
    expect(epic.children.map((c) => c.id)).toContain(sample.storyId);

    const story = await prisma.item.findUniqueOrThrow({
      where: { id: sample.storyId },
      include: { parent: true },
    });
    expect(story.parent?.id).toBe(sample.epicId);
  });

  it("versions an item and binds the assessment to the exact revision it scored", async () => {
    const revisions = await prisma.itemRevision.findMany({
      where: { itemId: sample.storyId },
      orderBy: { revisionNo: "asc" },
    });
    expect(revisions.map((r) => r.revisionNo)).toEqual([1, 2]);

    const assessment = await prisma.assessment.findUniqueOrThrow({
      where: { id: sample.assessmentId },
    });
    // The score binds to revision 2, not the item — that binding is what lets
    // Lucid diff scores across edits.
    expect(assessment.revisionId).toBe(sample.rev2Id);
    expect(assessment.revisionId).toBe(revisions[1].id);
  });

  it("rejects an item whose owner_id references no user (the owner seam is DB-enforced)", async () => {
    await expect(
      prisma.item.create({
        data: {
          ownerId: randomUUID(), // no such User
          backlogId: sample.backlogId,
          type: "story",
        },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
  });
});
