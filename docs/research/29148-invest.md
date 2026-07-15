# Requirement-Quality Criteria: ISO/IEC/IEEE 29148 + INVEST

> Research reference for Lucid's requirement/story grader. Resolves GitHub issue
> [#6](https://github.com/jakewisnieski/Lucid/issues/6). The goal is a **citable**
> catalogue of what makes a requirement/story "good," precise enough to compile
> directly into (a) LLM-critic rubric items and (b) deterministic lint checks.
>
> **Copyright note:** ISO/IEC/IEEE 29148:2018 is a copyrighted, paywalled standard.
> This document **does not reproduce the standard's text**. It uses the
> characteristic *names* and clause *numbers* (facts, freely usable) and states the
> meaning of each in **our own words (paraphrased)**, with citations so scores stay
> auditable. See [Licensing posture](#licensing-posture).

---

## 1. ISO/IEC/IEEE 29148 — the requirements-engineering standard

ISO/IEC/IEEE 29148:2018, *Systems and software engineering — Life cycle processes —
Requirements engineering*, defines what a "well-formed" requirement is. The quality
material lives in **Clause 5.2**:

- **§5.2.4 Requirements construct** — the shape of a well-formed requirement and the
  modal-verb conventions.
- **§5.2.5 Characteristics of individual requirements** — nine characteristics.
- **§5.2.6 Characteristics of a set of requirements** — five characteristics.
- **§5.2.7 Requirement language criteria** — categories of vague/ambiguous/unbounded
  language to avoid (basis of Lucid's weasel-word linter).
- **§5.2.8 Requirements attributes** — metadata (ID, owner, priority, rationale…)
  supporting traceability.

These requirement-quality characteristics are not unique to ISO — the same ideas
appear across the requirements-engineering literature (e.g. Karl Wiegers, *Software
Requirements*; the earlier IEEE 830). Lucid grounds its rubric in the **concepts**,
citing 29148 as the standard it aligns with, not in the standard's wording.

### 1.1 Individual-requirement characteristics (§5.2.5) — paraphrased

| # | Characteristic | Meaning (our paraphrase) |
|---|----------------|--------------------------|
| 1 | **Necessary** | States an essential capability/constraint/quality the system genuinely needs; drop it and a real gap appears that no other requirement fills. Still currently applicable (not obsolete). |
| 2 | **Appropriate** | Detail suits the entity's level of abstraction; says *what* is needed without over-constraining design/implementation. |
| 3 | **Unambiguous** | Admits only one reasonable interpretation; simply and clearly worded. |
| 4 | **Complete** | Fully describes the needed capability on its own, without requiring outside information to be understood. |
| 5 | **Singular** | Expresses exactly one capability/constraint/quality (may still carry multiple *conditions*). |
| 6 | **Feasible** | Realizable within cost/schedule/technical constraints at acceptable risk. |
| 7 | **Verifiable** | Worded so its satisfaction can be objectively proven; stronger when measurable. |
| 8 | **Correct** | Accurately reflects the actual stakeholder need it was derived from. |
| 9 | **Conforming** | Follows the agreed template/style conventions for requirements. |

### 1.2 Set-of-requirements characteristics (§5.2.6) — paraphrased

| # | Characteristic | Meaning (our paraphrase) |
|---|----------------|--------------------------|
| 1 | **Complete** | The set covers all needs on its own and contains no `TBD`/`TBS`/`TBR` placeholders. |
| 2 | **Consistent** | No conflicts, overlaps, or duplicates; homogeneous units; terminology used consistently throughout. |
| 3 | **Feasible** | The whole set is jointly realizable within constraints (the standard folds "affordable" in here — NOTE 4 — so there is **no** separate "Affordable" characteristic). |
| 4 | **Comprehensible** | The set reads clearly and its relation to the larger system is understandable. |
| 5 | **Able to be validated** | Satisfying the set would plausibly achieve the stakeholder needs within constraints. |

> **Terminology caution:** some third-party summaries render the set-level list as
> "Affordable / Bounded." That is not the normative 2018 list — the five above are.
> Use these exact clause names in the rubric so it stays auditable.

### 1.3 Requirements construct & modal verbs (§5.2.4)

Highest-value source of **deterministic** checks. A well-formed requirement names a
subject + an action (+ optional measurable condition/constraint). Keyword
conventions (agree in advance):

- **`shall`** — mandatory, binding (a real requirement).
- **`will`** — statement of fact/intent; non-binding.
- **`should`** — preference/goal; not a requirement.
- **`may`** — option/allowance; non-binding.
- Avoid **`must`** (ambiguous — reads as either obligation or requirement).
- Prefer **active voice** (flag "it is required that…") and **positive form** (flag `shall not`).
- Avoid vague capability phrasing like "shall be able to."
- Agile **user stories** are an accepted alternative formulation — which is why Lucid also grades stories against **INVEST** (§2).

### 1.4 Ambiguous-language taxonomy (§5.2.7)

29148 §5.2.7 calls for avoiding vague/unbounded terms because they defeat
verifiability. The categories below are the seed for Lucid's ambiguity linter; the
example words are a curated dictionary (see §4.4), informed by §5.2.7 and general RE
guidance:

| Category | Nature |
|----------|--------|
| Superlatives | unbounded goals ("best", "most") |
| Subjective terms | reader-dependent ("user friendly", "easy to use") |
| Vague pronouns | unclear antecedent ("it", "this", "that") |
| Ambiguous modifiers | unquantified ("significant", "minimal", "quickly") |
| Ambiguous logic | "and/or", bare "or" — split into separate requirements |
| Open-ended phrases | non-exhaustive ("including but not limited to", "as a minimum") |
| Comparatives without a baseline | "better than", "higher quality" |
| Loopholes | escape hatches ("if possible", "as appropriate") |
| Totality terms | hard to verify ("all", "always", "never", "every") |
| Incomplete references | citations without date/version/section |

---

## 2. INVEST — quality criteria for user stories

INVEST is the standard mnemonic for a good backlog item, **coined by Bill Wake**
(2003, xp123.com) and popularized by **Mike Cohn** (*User Stories Applied*, 2004).
Paraphrased:

| Letter | Criterion | Meaning (our paraphrase) |
|--------|-----------|--------------------------|
| **I** | Independent | Can be scheduled/built in any order; doesn't overlap other stories. |
| **N** | Negotiable | A conversation-starter, not a rigid contract of features; details co-created. |
| **V** | Valuable | Delivers clear value to a specific user/customer. |
| **E** | Estimable | Enough is known to size it, at least roughly. |
| **S** | Small | Small enough to complete within an iteration. |
| **T** | Testable | Written so you could, in principle, write a test/acceptance check for it. |

Cross-mapping for Lucid: INVEST **Testable** ≈ 29148 **Verifiable**; **Small/Estimable**
relate to **Singular/Feasible**; **Independent** relates to set-level **Consistent**.

---

## 3. Deterministic vs. LLM-critic classification

Which characteristics a **deterministic lint** (regex/parser, clear pass/fail) can
enforce vs. which need **LLM-critic judgment**. Many are **hybrid**: a lint flags
candidates cheaply and explainably; the critic renders the confident verdict.

### 3.1 29148 individual characteristics
| Characteristic | Check type | Notes |
|----------------|-----------|-------|
| Necessary | LLM-critic | Judgment on essential/duplicative. |
| Appropriate | Lint flags / LLM confirms | Lint: design/impl verbs, tech names ("via", "using") = "how not what". |
| Unambiguous | Lint flags / LLM confirms | Lint: ambiguity dictionary (§1.4), vague pronouns, "and/or". |
| Complete | Lint → LLM | Lint: `TBD`/`TBS`/`TBR`/`???` placeholders. Coverage = LLM. |
| Singular | Lint flags / LLM confirms | Lint: conjunction / multiple-`shall` / bullet count = compound candidate. |
| Feasible | LLM-critic | Cost/schedule/risk reasoning; no reliable lint. |
| Verifiable | Lint flags / LLM confirms | Lint: measurable value (number+unit); flag non-verifiable terms. |
| Correct | LLM-critic | Needs the source need to compare against. |
| Conforming | Deterministic | Structural: subject+`shall`+action, modal-verb rules, active/positive voice, ID present. |

### 3.2 29148 set-level characteristics
| Characteristic | Check type | Notes |
|----------------|-----------|-------|
| Complete (set) | Lint → LLM | Lint: any `TBx` remaining → fail. Coverage = LLM. |
| Consistent (set) | Lint flags / LLM confirms | Lint: duplicate detection, mixed units, term drift. Semantic conflict = LLM. |
| Feasible (set) | LLM-critic | Aggregate feasibility. |
| Comprehensible (set) | LLM-critic | Readability metric = weak signal. |
| Able to be validated (set) | LLM-critic | Whether satisfying the set meets the goal. |

### 3.3 INVEST
| Criterion | Check type | Notes |
|-----------|-----------|-------|
| Independent | LLM-critic | Lint explicit "depends on"/"blocked by"/"after". |
| Negotiable | Lint flags / LLM confirms | Lint over-specified UI/impl detail. |
| Valuable | Lint flags / LLM confirms | Lint presence of a "so that…" benefit clause. |
| Estimable | LLM-critic | Enough known to size it. |
| Small | Lint flags / LLM confirms | Size proxy: AC count, length, "and" count. |
| Testable | Lint flags / LLM confirms | Lint: has AC? observable/quantified outcome? |

---

## 4. Rubric implications for Lucid

Each characteristic → a **(rubric-item | deterministic-check)** pair. Deterministic
checks run first (cheap, explainable) and either fail outright or feed the critic as
evidence; rubric items are LLM-critic prompts scored per requirement/story.

### 4.1 Individual-requirement rubric (§5.2.5)
| Characteristic | Rubric item (critic prompt seed) | Deterministic check |
|----------------|----------------------------------|---------------------|
| Necessary | "Essential, and not redundant with others?" | Flag stale/obsolete metadata if present. |
| Appropriate | "States *what*, not *how*, at the right level?" | Flag tech/product names, "by using", "via". |
| Unambiguous | "Could a reasonable reader read this two ways?" | Ambiguity linter (§1.4 / §4.4 dictionary). |
| Complete | "Fully describes the capability standalone?" | Fail on `TBD`/`TBS`/`TBR`/`???`/`<…>`. |
| Singular | "Exactly one capability/constraint/quality?" | Flag conjunctions, multiple `shall`, bullets. |
| Feasible | "Realizable within constraints at acceptable risk?" | (none reliable) |
| Verifiable | "Objectively provable? Measurable?" | Require number+unit for performance reqs; flag non-verifiable terms. |
| Correct | "Accurately reflects the stakeholder need?" | (none — needs source need) |
| Conforming | "Follows the required template/style?" | Structural linter: subject+`shall`+action; modal verbs; active/positive; ID unique. |

### 4.2 Set-level rubric (§5.2.6)
| Characteristic | Rubric item | Deterministic check |
|----------------|-------------|---------------------|
| Complete (set) | "Covers all stated needs? Any unresolved TBx?" | Fail set if any `TBx` remain. |
| Consistent (set) | "Conflicts, overlaps, term drift?" | Duplicate + mixed-unit + glossary-drift checks. |
| Feasible (set) | "Whole set jointly realizable?" | (none) |
| Comprehensible (set) | "Clear and understandable as a whole?" | Optional readability metric. |
| Able to be validated (set) | "Would satisfying it achieve the goals?" | (none) |

### 4.3 Story rubric (INVEST)
| INVEST | Rubric item | Deterministic check |
|--------|-------------|---------------------|
| Independent | "Buildable in any order?" | Flag "depends on"/"blocked by"/"after". |
| Negotiable | "Leaves room for how, or over-specifies?" | Flag heavy UI/impl detail. |
| Valuable | "Clear value to a specific user?" | Require "so that…" clause in the story template. |
| Estimable | "Enough clarity to size it?" | (none) |
| Small | "Fits in one iteration?" | Size proxy: AC count, length, "and" count. |
| Testable | "Could we write an acceptance check?" | Require AC; require observable/quantified outcome. |

### 4.4 Starter ambiguity dictionary (Lucid's own list, informed by §5.2.7 + RE guidance)
```
superlatives:        best, most, worst, least, optimal, maximum, minimum (as goals)
subjective:          user friendly, easy to use, easy, simple, cost effective, efficient, flexible, robust, seamless, intuitive, state of the art
vague_pronouns:      it, this, that, these, those, they  (when the antecedent is unclear)
ambiguous_modifiers: almost always, significant, significantly, minimal, adequate, appropriate, sufficient, reasonable, quickly, fast, slow, approximately, about, some, several, many, few
ambiguous_logic:     and/or, or        (split into separate requirements)
open_ended:          provide support, support for, but not limited to, as a minimum, including, etc., and so on, tbd
comparatives:        better than, higher quality, faster than, more than  (without a baseline)
loopholes:           if possible, if practical, as appropriate, as applicable, as required, where possible, to the extent possible, normally, typically
totality:            all, always, never, every, none, any  (hard to verify)
weak_modals:         must (ambiguous), should be able to, shall be able to
passive_voice:       it is required that, will be, is to be  (actor hidden)
placeholders:        TBD, TBS, TBR, ???, XXX, <placeholder>, to be determined, to be defined
```
> This dictionary is Lucid's own curated list. Mark opinionated additions
> (e.g. "seamless", "robust", "intuitive") as "extended" so the standards-grounded
> core stays separable and auditable.

---

## Licensing posture

Lucid grades against the **concepts** of good requirements (characteristic names,
clause numbers, general meaning) — which are facts and freely usable — expressed in
**our own words**. It does **not** embed or redistribute ISO/IEC/IEEE 29148 text.
The same characteristics are documented in freely available sources (Wiegers; Wake's
INVEST article), which Lucid can additionally cite. This keeps the rubric usable in
a commercial product without an ISO license. See issue #6 for the discussion.

## Sources

- **ISO/IEC/IEEE 29148:2018**, *Systems and software engineering — Life cycle
  processes — Requirements engineering*, Clause 5.2 (referenced by clause number,
  not reproduced). Official records:
  <https://standards.ieee.org/ieee/29148/6937/> ·
  <https://www.iso.org/standard/72089.html>.
- **Bill Wake**, *"INVEST in Good Stories, and SMART Tasks,"* XP123, 2003 —
  origin of INVEST: <https://xp123.com/invest-in-good-stories-and-smart-tasks/>.
- **Agile Alliance**, glossary entry *"INVEST"*:
  <https://agilealliance.org/glossary/invest/>.
- **Mike Cohn**, *User Stories Applied*, Addison-Wesley, 2004 (Ch. 2).
- **Karl Wiegers & Joy Beatty**, *Software Requirements* (3rd ed.) — freely
  available treatment of requirement-quality characteristics, useful as a
  non-paywalled corroborating source.
