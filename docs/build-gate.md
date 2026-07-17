# The module build gate — how each Slice-1 module ships

This is the **build-phase companion** to [`github-workflow.md`](github-workflow.md). That doc says every change reaches `main` only through a passing, reviewed PR; this one says *exactly how* each Slice-1 build module (M1–M16) runs that gate — the automated pass, the intent it needs, and the human acceptance step — so "done" always means the same thing.

> **One-line version:** every module closes out through **two gates** — an automated `/no-mistakes` pass (Gate 0) and Jake's hands-on SOP acceptance (Gate 1) — and Claude never self-merges.

---

## The two gates

**Gate 0 — automated (`/no-mistakes`).** After the work is committed on a feature branch off `main`, Claude runs the [`no-mistakes`](https://toonformat.dev) pipeline: **intent → rebase → review → test → document → lint → push → PR → CI**. It validates committed history (not the working tree), opens the PR, and returns `checks-passed` when CI is green — **it never merges**. This is the automated half of the review gate from `github-workflow.md` §4 (it subsumes the CI checks + the `/code-review` self-review + the PR open), plus tests, lint, and docs.

**Gate 1 — human acceptance (Jake).** Once Gate 0 is green, Jake runs the module's **acceptance walkthrough** — the module-specific SOP scenarios in the issue — as the end user. On all-PASS he approves; Claude then **squash-merges and deletes the branch**. This is Jake's end-user acceptance from §4, made concrete per module.

Neither gate is skippable, and the order is fixed: **Gate 0 green → Gate 1 pass → merge.**

---

## Intent is the load-bearing input

`/no-mistakes` **requires** an `--intent`: *what the work set out to accomplish*, in our terms — not a description of the diff. The review step uses it to **tell a deliberate decision apart from a mistake**, so a thin one-line intent makes it flag choices we made on purpose. It must be rich: the goal, the specific decisions and tradeoffs, constraints ruled in/out, and anything in the diff that would surprise a reviewer.

We supply intent with a **"seed now, finalize at gate"** model:

1. **Seed (authored at planning).** Every module issue carries an **Intent seed** — a charter-level paragraph: the goal, the deliberate choices grounded in our decisions (#4–#13), the constraints, and what's out of scope. Jake reviews the seeds when the issues are created.
2. **Finalize (at build time).** Right before the gate, Claude composes the actual `--intent` = the **then-current** issue seed **+** the concrete as-built decisions made while coding the module. Because it's composed at build time, any edit to the issue — or a shift in a grounding decision — flows through automatically; nothing is frozen at planning to go stale.
3. **Quick-confirm.** Claude shows Jake the composed intent for a ~10-second confirm, then runs the gate.

Why not a frozen intent block approved at planning? Because intent has two layers, and only one exists at planning time: the **charter** (known now) and the **as-built decisions** (knowable only once the code exists). The skill explicitly wants the second layer, and a frozen block can't hold it — so we seed the charter and finalize at the gate.

### `ask-user` findings

Some `/no-mistakes` review findings are marked `ask-user` — the pipeline judged that they challenge a deliberate intent or change product behavior, so **only Jake** can rule on them. Claude relays each one to Jake **verbatim** (id, file, description) and never fixes, approves, or skips it alone — unless Jake has given standing `--yes` consent to drive the whole run. `auto-fix` / `no-op` findings Claude can drive on its own judgment.

---

## What every module issue contains

Each Slice-1 issue (M1–M16) is stamped from one template:

- **Outcome** — what the module delivers.
- **Acceptance criteria** — the technical definition of done.
- **Grounded in** — the decisions it draws on (#4–#13).
- **Intent seed** — the charter-level `--intent` seed (finalized at the gate).
- **Acceptance walkthrough** — Jake's SOP scenarios: exact command/click + the explicit PASS condition, runnable by hand (non-UI modules ship a `try:<module>` script + fixtures).
- **Close-out** — the two-gate sequence above.

All 16 are grouped under the **Slice 1** milestone (label `slice-1`), created at once, and built one at a time in dependency order. Release target `v0.1.0`.

---

## The per-module loop, end to end

1. **Branch** off `main` (`feat/…` or `chore/…`), one per issue.
2. **Build + commit** in small steps on the branch.
3. **Finalize intent** = issue seed + as-built decisions → **Jake quick-confirms**.
4. **Gate 0:** `no-mistakes axi run --intent "…"` → drive it (auto-fix findings on Claude's judgment; escalate `ask-user` to Jake) → **`checks-passed`** (PR green, not merged).
5. **Gate 1:** Jake runs the issue's acceptance walkthrough → all-PASS → **approves**.
6. **Merge:** Claude squash-merges + deletes the branch; the issue closes via the PR's `Closes #<n>`.
7. **Repeat** for the next module. When all 16 are merged, cut the `v0.1.0` release.

> A note on CI: the automated CI that Gate 0 relies on is itself **turned on by M1** (it was deferred until the stack was chosen). M1's own PR proves CI green; every module from M2 on runs the full gate.
