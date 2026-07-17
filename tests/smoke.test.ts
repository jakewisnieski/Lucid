import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, it, expect } from "vitest";

// Proves the test harness runs in CI, and guards the secret-handling contract:
// .env.example must document the two vars M1 promises (DATABASE_URL, ANTHROPIC_API_KEY).
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const envExample = readFileSync(join(repoRoot, ".env.example"), "utf8");

describe(".env.example", () => {
  it("documents the required environment variables", () => {
    expect(envExample).toMatch(/^DATABASE_URL=/m);
    expect(envExample).toMatch(/^ANTHROPIC_API_KEY=/m);
  });
});
