# Decision log

The *why* behind Lucid's load-bearing decisions. Product decisions are charted in detail on the [wayfinder map](https://github.com/jakewisnieski/Lucid/issues?q=label%3Awayfinder%3Amap); this log records the ones worth reading in one place. Newest last.

---

### 1. Adopt the full SDLC / GitHub workflow from day one
Every change reaches `main` only through a passing, reviewed PR; branch protection was turned on while `main` was a clean scaffold. **Why:** the process is easiest to make real on an empty repo, and the audit trail (issue → PR → review → merge) is itself a deliverable. See [`github-workflow.md`](github-workflow.md).

### 2. Plan on a wayfinder map (GitHub Issues), not straight into code
Product decisions are charted as a `wayfinder:map` issue with child decision tickets, worked one at a time and grounded in primary sources. **Why:** the idea is large and foggy; deciding before building keeps the first slice honest and the reasoning inspectable.

### 3. Lucid is a real, usable tool — not only a demo
The target is a tool a working BA (and the author) would actually use on real work, which also demonstrates broader product-management skill. **Why:** the bar "a working BA trusts it on real work" is more demanding and more credible than "looks good in a demo," and a genuine app carries the demo for free.

### 4. Slice 1 is single-user / local; security & multi-user are Slice 2 — but we design to scale into them
The first slice is used personally and handed to no one, so auth, access control, and multi-tenant security are deferred. **Why:** it keeps Slice 1 small and shippable. **Constraint:** the architecture must not preclude the Slice 2 jump to security + multi-user — design the seams for it now, don't wall them off.
