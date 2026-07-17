// try:seed-sample — creates a sample backlog owned by the local user: a
// versioned item (two revisions) with an Assessment bound to the second
// revision, plus a row in every other table. Ensures the local owner exists
// first, so it is safe to run on a freshly-migrated database.
import { PrismaClient } from "@prisma/client";
import { ensureLocalUser } from "../src/lib/db/local-user";
import { seedSampleBacklog } from "../src/lib/db/sample";

async function main() {
  const prisma = new PrismaClient();
  try {
    const owner = await ensureLocalUser(prisma);
    const sample = await seedSampleBacklog(prisma, owner.id);
    console.log("try:seed-sample ok — created sample backlog");
    console.log(`  backlog:     ${sample.backlogId}`);
    console.log(`  story item:  ${sample.storyId} (parent epic ${sample.epicId})`);
    console.log(`  revisions:   ${sample.rev1Id} (no.1), ${sample.rev2Id} (no.2)`);
    console.log(`  assessment:  ${sample.assessmentId} -> bound to revision ${sample.rev2Id}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(
    "try:seed-sample failed:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
