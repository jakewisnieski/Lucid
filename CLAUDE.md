# Working on Lucid — operating rules for Claude

Full process contract: **[`docs/github-workflow.md`](docs/github-workflow.md)**. This file is the short, always-loaded version so the workflow actually sticks each session.

Lucid is a working business analyst's assistant: it turns vague, contradictory stakeholder input (Slack threads, forwarded emails, meeting notes) into a sprint-ready, **quality-scored** backlog — showing its work at every step, letting the analyst correct it, and grading output against what *actually* makes a requirement good. Core design principle: a **generator/critic split** — a separate, rubric-driven critic pass scores the output, backed by deterministic checks (weasel words, INVEST).

## Roles
- **Jake owns intent + gates:** what the work is, when it's good enough, whether it merges.
- **Claude runs the mechanics:** branches, commits, PRs, self-review — but **never merges to `main` or tags a release without Jake's explicit go-ahead**, and **explains anything that touches `main` before doing it.**

## The default loop for any non-trivial work
1. **Issue** — the work as an outcome + acceptance criteria, assigned to a Milestone.
2. **Branch off `main`** — one branch per issue: `feat/…`, `fix/…`, `docs/…`, `refactor/…`, `chore/…`. Never commit straight to `main`.
3. **Small commits** — one coherent change each, [Conventional Commits](docs/github-workflow.md#conventional-commits) prefix (`feat/fix/docs/test/refactor/chore`). Prefer many small over one giant.
4. **Pull Request → `main`** — description says what changed + `Closes #<n>`. Gates: CI green (once it exists), Claude self-review (`/code-review`), Jake's end-user acceptance.
5. **Squash-merge on Jake's approval**, delete the branch.
6. **Tag a release at milestone boundaries** — SemVer (`v0.1.0` = first slice). Only on Jake's go-ahead.

## Non-negotiables
- **`main` is sacred** — the only path onto it is a passing, reviewed PR. Branch protection is **on** (active ruleset, no bypass).
- **Never commit secrets.** If a `.env` or key is about to be staged, stop. `.gitignore` covers `.env*` — verify before trusting.
- **Small PRs over big ones.** If an issue feels big, split it.
- **Commit/push only when asked.** Don't push, open PRs, or merge on your own initiative.

## Planning happens on the issue tracker (wayfinder)
Product decisions are charted as a **wayfinder map** and decision tickets on **GitHub Issues** (labels `wayfinder:*`) — these are *decisions*, not code, so the build loop above doesn't fire during planning. The build loop fires once we start building what the map decided. Grilling is grounded in primary sources ("grill with docs"); the *why* behind big calls lands in [`docs/decision-log.md`](docs/decision-log.md).

## Current state (2026-07-15)
Scaffold + workflow setup. **Lucid is being built as a real, usable tool** for working BAs (used personally too), not just a portfolio demo — the bar for "good" is *a working BA trusts it on real work*. We are **wayfinding Slice 1**: the smallest end-to-end loop (paste messy input → decomposed, quality-scored, correctable backlog → export). **Slice 1 is single-user / local — security, auth, and multi-user are deferred to Slice 2, but the architecture must not preclude scaling into them.** No stack chosen yet (CI is deferred until it is).
