import type { PrismaClient } from "@prisma/client";

/** Ids of the rows created by {@link seedSampleBacklog}, for assertions/inspection. */
export interface SampleBacklog {
  backlogId: string;
  epicId: string;
  storyId: string;
  rev1Id: string;
  rev2Id: string;
  assessmentId: string;
}

/**
 * Create one fully-populated sample backlog owned by `ownerId`, touching all
 * ten tables. It exercises the two seams the schema exists to carry:
 *
 *  - the self-referential item tree (an epic with a story child), and
 *  - a versioned item (the story has two immutable revisions) whose second
 *    revision is bound to an Assessment — the exact-revision score binding.
 *
 * Shared by `try:seed-sample` (against the local owner) and the schema tests
 * (against a throwaway owner), so both prove the same shape.
 */
export async function seedSampleBacklog(
  prisma: PrismaClient,
  ownerId: string,
): Promise<SampleBacklog> {
  const backlog = await prisma.backlog.create({
    data: { ownerId, title: "Sample: checkout revamp" },
  });

  await prisma.sourceInput.create({
    data: {
      ownerId,
      backlogId: backlog.id,
      kind: "slack",
      content:
        "can we make checkout faster? guest checkout maybe. also the coupon field is broken sometimes",
    },
  });

  // Tree: an epic with one story child (epic -> story).
  const epic = await prisma.item.create({
    data: { ownerId, backlogId: backlog.id, type: "epic" },
  });
  const story = await prisma.item.create({
    data: { ownerId, backlogId: backlog.id, type: "story", parentId: epic.id },
  });

  // Versioning: the story gets two immutable revisions. rev1 is the pipeline's
  // first pass; rev2 is a sharpened edit that appends (never rewrites) rev1.
  const rev1 = await prisma.itemRevision.create({
    data: {
      ownerId,
      itemId: story.id,
      revisionNo: 1,
      asA: "shopper",
      want: "to check out faster",
      soThat: "I don't abandon my cart",
      position: 0,
      acceptanceCriteria: {
        create: [
          { ownerId, text: "Checkout completes in fewer steps", position: 0 },
        ],
      },
    },
  });
  const rev2 = await prisma.itemRevision.create({
    data: {
      ownerId,
      itemId: story.id,
      revisionNo: 2,
      asA: "returning shopper",
      want: "to complete checkout as a guest",
      soThat: "I can buy without creating an account",
      position: 0,
      acceptanceCriteria: {
        create: [
          {
            ownerId,
            text: "Given a guest, when they submit valid payment, the order is placed",
            position: 0,
          },
          {
            ownerId,
            text: "Given a guest, when checkout succeeds, no account is created",
            position: 1,
          },
        ],
      },
    },
  });

  // Assessment binds to the exact revision it scored (rev2), with per-
  // characteristic verdicts from both the deterministic lint and the critic.
  const assessment = await prisma.assessment.create({
    data: {
      ownerId,
      backlogId: backlog.id,
      revisionId: rev2.id,
      gateResult: "pass",
      readinessScore: 82,
      verdicts: {
        create: [
          {
            ownerId,
            characteristic: "testable",
            verdict: "pass",
            source: "lint",
            rationale: "Acceptance criteria are in Given/When/Then form.",
          },
          {
            ownerId,
            characteristic: "valuable",
            verdict: "weak",
            source: "critic",
            rationale: "Value is implied but not quantified.",
            suggestedFix: "State the target reduction in cart abandonment.",
          },
        ],
      },
    },
  });

  // HITL lineage: the edit from rev1 to rev2 is recorded as a correction.
  await prisma.correction.create({
    data: {
      ownerId,
      itemId: story.id,
      fromRevisionId: rev1.id,
      toRevisionId: rev2.id,
      action: "edit",
      actor: "user",
    },
  });

  await prisma.clarifyingQuestion.create({
    data: {
      ownerId,
      backlogId: backlog.id,
      question: "Should guest checkout still capture an email for the receipt?",
      status: "open",
    },
  });

  return {
    backlogId: backlog.id,
    epicId: epic.id,
    storyId: story.id,
    rev1Id: rev1.id,
    rev2Id: rev2.id,
    assessmentId: assessment.id,
  };
}
