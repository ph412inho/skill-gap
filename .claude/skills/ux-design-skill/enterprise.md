# Enterprise & Internal SaaS UX

Enterprise tools break consumer assumptions: users are **trained, repeat, expert**, the data
is **dense**, the stakes are **operational**, and the "customer" (buyer) is often not the
**user**. The fundamentals still hold — but several defaults flip. Primary source:
Kauer-Franz (ISO 9241 principles, BusinessBooster B2B example) + Tesler/Hick from Yablonski.

---

## What flips vs. consumer UX

| Consumer default | Enterprise reality |
|---|---|
| Minimize on-screen info | Show as much as the *task* needs — experts want density, not hand-holding |
| Avoid jargon | **Domain vocabulary is correct and preferred** (reconcile, accrual, SKU) |
| Optimize first-use | Optimize the **1,000th** use — speed for daily power users |
| Mouse/touch first | **Keyboard-first**: shortcuts, tab order, bulk actions |
| One-size layout | **Configurable**: customizable dashboards, columns, saved views |
| Single user | **Roles & permissions**: the UI changes by who's looking |
| Delight = surprise | Delight = **efficiency, reliability, and not losing my work** |

---

## Density done right (not clutter)

"As little information as possible, **as much as is necessary** to perform the task" — and for
experts, "necessary" is a lot. The craft is *organized* density, not less data.

- **Chunk and group** dense data (Proximity, Common Region, dividers, alignment) so the eye
  parses it. Density without structure is clutter; density with structure is power.
- **Information hierarchy over information hiding.** Don't bury what experts need behind clicks;
  arrange it so the important is prominent and the rest is scannable.
- **Tables are a first-class UI.** Sort, filter, freeze columns, resize, bulk-select, inline
  edit, saved views, export. A great enterprise table beats a hundred cards.
- **Respect Miller** *across screens*, not within: don't force users to hold values in memory
  between steps — keep context visible (recognition over recall).

---

## Domain vocabulary (don't dumb it down)

- Internal/professional users have a **shared technical language**; using it makes them faster
  and signals the tool respects their expertise. Accountants want "reconcile," not "match up."
- The jargon may need to be learned once — that's acceptable for a tool used daily, and it pays
  back every day after. (Kauer-Franz, verbatim guidance for internal apps.)
- *Caveat:* match the *users'* domain language, not your internal engineering codenames.
  Self-descriptiveness ≠ baby talk, but it also ≠ leaking your database schema.

---

## Controllability is paramount (ISO 9241 Controllability)

Expert tools must hand control to the user:

- **Multi-step undo/redo**, not just one level. Experts make and revise many changes.
- **Autosave + versioning + history.** Never lose work; let users roll back. This is the #1
  trust-builder in enterprise.
- **Interrupt and resume.** Long workflows must survive a phone call, a logout, a context
  switch. Save drafts and restore state.
- **Customization:** reorder fields, configurable dashboards, column choices, saved filters,
  reset-to-defaults. Different roles work differently — let them shape the tool.
- *Exception:* override user control only for **security/compliance** (banking auto-logout,
  mandated approval steps) — and explain why.

---

## Controls: disable vs. remove, and self-descriptiveness

- **Gray out (but keep visible)** a control the user *sometimes* can use, so they learn it
  exists and discover the condition to enable it — but always hint *how* to enable it (don't
  leave a dead, unexplained disabled button).
- **Remove entirely** a control the user's role will *never* use — don't tease capabilities
  they can't have.
- **Self-descriptiveness:** breadcrumbs, progress indicators, and persistent frequently-used
  controls so a returning expert instantly re-orients. Provide **multiple access paths** (menu
  *and* search/command palette) — experts navigate by search, novices by menu.

---

## Learnability for complex tools

Feature-dense tools still need a gentle on-ramp:

- **Sandbox / simulation mode** to explore safely without consequences (a demo workspace,
  sample data). Reversible exploration is how experts learn power features.
- **Templates and sample data** in empty states — an enterprise empty screen should offer a
  starting template and a path to **import existing data**, not just "create from scratch."
- **Contextual guidance, not manuals** (Paradox of the Active User: people won't read docs).
  Tooltips, inline tips, command-palette discovery, "what's new" for changed workflows.
- **Conform to expectations** for migrators — match the conventions of the incumbent tool users
  are switching from, so their existing mental model transfers (Jakob's Law in B2B).

---

## The buyer ≠ user problem

- The person who **buys** (procurement, a manager) optimizes for features, compliance, and
  price; the person who **uses** it lives with the daily friction. Design for the user, sell to
  the buyer — and surface the user's reality (adoption, support tickets) to justify it.
- **Adoption is the real metric.** A bought-but-unused tool failed. Watch usage data and ticket
  themes (see evaluation, below).

---

## Trust, permissions, and consequence

- **Permissions shape the UI.** What a user can see and do changes by role — design each role's
  view, and make it clear *why* something is unavailable ("requires admin").
- **High-consequence actions** (bulk delete, financial posting, sending to all customers) need
  proportionate safeguards: clear restatement of scope ("this emails 4,210 customers"), undo
  where possible, and an approval/confirmation only where reversal isn't.
- **Reliability is the core delight.** In enterprise, "award-winning" means it's fast, it never
  loses my work, it does the same thing every time, and it gets out of my way. Polish serves
  trust (Aesthetic-Usability), but consistency and reliability *are* the experience.

---

## Evaluation (you already have the data)

Enterprise/cloud tools sit on usage data and support tickets — mine them (Kauer-Franz, Ch.12):

- **Quantitative usage data:** rank features by usage/duration; a feature ranking last is
  ambiguous — ignored *or* undiscoverable — so pair with qualitative "why." Mind GDPR /
  employee-monitoring law for internal tools (anonymize; don't drift into performance tracking).
- **Ticket analysis:** categorize tickets into themes, count frequency, deep-dive the top
  themes. Cheap, high-yield, usually under-used. *But* tickets over-represent technical breakage
  and under-represent *usability* friction (users don't file a ticket for "it's annoying"), so
  it's a floor on problems, not the ceiling.
- **Benchmark with a baseline:** SUS / AttrakDiff / UX benchmarking only mean something against
  a reference (prior version, competitor). Establish baseline values, then track over releases.

---

## Enterprise quick test

- [ ] Is it fast and keyboard-friendly for the daily power user (not just pretty for the demo)?
- [ ] Does it use the users' **domain language**?
- [ ] Multi-step undo, autosave, versioning, interrupt/resume — all present?
- [ ] Can users customize views/dashboards/columns to their workflow?
- [ ] Does each role get a coherent view, with unavailable things explained?
- [ ] Do empty states offer templates and a data-import path?
- [ ] Are high-consequence actions scoped, restated, and reversible where possible?
- [ ] Are you mining usage data + tickets (with a baseline) to find real friction?
