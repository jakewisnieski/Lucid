# Lucid

**A working business analyst's assistant that turns vague, contradictory stakeholder input into a sprint-ready, quality-scored backlog — and shows its work at every step.**

## The problem

Business analysts spend their days reconciling messy, contradictory signals: a Slack thread that trails off, a forwarded email that says the opposite of the last one, meeting notes that capture three half-decisions. Turning that into a clean, prioritized, sprint-ready backlog is *judgment work* — and good BAs are rare precisely because that judgment is hard to teach and harder to scale.

## What Lucid does

Lucid takes raw, unstructured stakeholder input — Slack threads, forwarded emails, meeting notes — and produces a **sprint-ready backlog**: well-formed work items with clear acceptance criteria, surfaced contradictions, flagged assumptions, and a **quality score** for each item.

Crucially, Lucid:

- **Shows its work at every step.** You can see how it got from a messy thread to a proposed story — what it inferred, what it assumed, what it ignored, and why.
- **Lets you correct it.** Every inference is reviewable and editable. Lucid learns from the correction rather than burying it.
- **Grades against what's *actually* good, not what people *think* is good.** The quality score is anchored to real markers of good analysis (clear value, testable acceptance criteria, resolved ambiguity, sized appropriately) — not surface-level polish.

Lucid is a **judgment amplifier** for business analysts: it applies the good judgment that good BAs already use every day, makes that judgment visible and correctable, and holds the output to a real quality bar.

## Status

🌱 Early stage — building **Slice 1**, the smallest end-to-end loop (paste messy input → decomposed, quality-scored, correctable backlog → export). The stack is chosen and the app skeleton is up (M1); the real product surfaces arrive later in the slice.

## Getting started

Slice 1 runs locally as a single-user app. Stack: **Next.js (App Router) + TypeScript**, **React**, **Postgres (Neon) via Prisma**, tested with **Vitest**.

**Prerequisites:** Node.js 22 and npm.

```bash
npm install              # installs deps and runs `prisma generate`
cp .env.example .env     # then fill in the values below
```

Configure `.env` (never committed — `.env*` is gitignored except `.env.example`):

- `DATABASE_URL` — Neon Postgres connection string, read by Prisma and `npm run db:ping`.
- `ANTHROPIC_API_KEY` — server-side only; documented now, first used in M3.

**Scripts:**

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run db:ping` | Verify the `DATABASE_URL` connection (`SELECT 1`) |

## License

TBD
