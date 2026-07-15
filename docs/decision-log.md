# Decision log

The *why* behind Lucid's load-bearing decisions. Product decisions are charted in detail on the [wayfinder map](https://github.com/jakewisnieski/Lucid/issues?q=label%3Awayfinder%3Amap); this log records the ones worth reading in one place. Newest last.

---

### 1. Adopt the full SDLC / GitHub workflow from day one
Every change reaches `main` only through a passing, reviewed PR; branch protection was turned on while `main` was a clean scaffold. **Why:** the process is easiest to make real on an empty repo, and the audit trail (issue → PR → review → merge) is itself a deliverable. See [`github-workflow.md`](github-workflow.md).

### 2. Plan on a wayfinder map (GitHub Issues), not straight into code
Product decisions are charted as a `wayfinder:map` issue with child decision tickets, worked one at a time and grounded in primary sources. **Why:** the idea is large and foggy; deciding before building keeps the first slice honest and the reasoning inspectable.

### 3. Slice 1 is single-user / local; security & multi-user are Slice 2 — but we design to scale into them
The first slice is used personally and handed to no one, so auth, access control, and multi-tenant security are deferred. **Why:** it keeps Slice 1 small and shippable. **Constraint:** the architecture must not preclude the Slice 2 jump to security + multi-user — design the seams for it now, don't wall them off.

### 4. Scoring: an independent critic plus hard gates — not a single averaged number
A backlog item is a **user story + acceptance criteria**, scored **INVEST-primary** with the 29148 §5.2.5 characteristics as the deeper checks on the text and ACs. Deterministic linters run first (cheap, explainable) and either hard-fail or hand flags as evidence to an **independent critic pass** that renders per-characteristic **pass/weak/fail** verdicts with rationale and a fix. "Sprint-ready" is decided by **hard gates** (no placeholders, Singular, Verifiable, Valuable, no critical ambiguity); a weighted readiness score only ranks what to fix next. The same generate→lint→critic split runs once more at the **set level**, after items clear their gates. **Why:** a single 0–100 average lets an ambiguous requirement hide behind otherwise-good scores, and a generator grading its own output inflates. Gates keep the bar honest, an independent critic makes the "generator/critic split" mean something, and per-characteristic verdicts backed by evidence make every score correctable — which is Lucid's whole premise. See [#7](https://github.com/jakewisnieski/Lucid/issues/7), grounded in [#6](https://github.com/jakewisnieski/Lucid/issues/6).
