import type { PrismaClient, User } from "@prisma/client";

// The one local owner for Slice 1. A fixed id (not random) so `db:seed` is
// idempotent — re-running upserts the same row instead of piling up users, and
// scripts can reference the owner without a lookup. This single seeded User is
// the entire auth story for Slice 1 (#3); `ownerId` self-references `id`,
// keeping the owner seam uniform across every table (see prisma/schema.prisma).
export const LOCAL_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "local@lucid.dev",
  name: "Local Analyst",
} as const;

/** Idempotently ensure the single local owner exists; returns it. */
export function ensureLocalUser(prisma: PrismaClient): Promise<User> {
  return prisma.user.upsert({
    where: { id: LOCAL_USER.id },
    update: {},
    create: {
      id: LOCAL_USER.id,
      ownerId: LOCAL_USER.id,
      email: LOCAL_USER.email,
      name: LOCAL_USER.name,
    },
  });
}
