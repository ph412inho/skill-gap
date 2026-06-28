# Checklists & Tests — ready to run

Pull these out in **Review mode** against any screen, flow, or feature. They operationalize
the principles into yes/no checks. Start with the fast tests; escalate to the full audits when
something fails or the stakes are high.

---

## The ten-second tests (run constantly)

- **Label test** — Does any control need a tooltip/instruction to be understood? → broken
  (add a text label or remove it). *Norman: "if it needs a sign, the design failed."*
- **Orphan-button test** — For each control: what happens when I press it? If "nothing," "same
  as that other one," or "not sure" → it shouldn't exist.
- **Dead-end test** — From this screen, is there a visible way out, back, and undo? No → trap.
- **Feedback test** — After I act, within 400ms can I tell it registered, and afterward what
  state I'm in? No → widen the response, narrow the gulf of evaluation.
- **Recall test** — Must the user remember something from a previous screen to act here? → move
  it into the world (show it, or offer a pick-list).
- **Squint test** — Squint at the screen: does what stands out match what matters? If not, fix
  the visual hierarchy.
- **"So what if it's wrong" test (AI)** — If the model is wrong here, what does the user pay?
  Trivial → don't interrupt. Costly → restate / confirm / require approval / undo.

---

## Flow & exit-room audit (smooth flow, no traps)

Walk the whole task end to end, then check:

- [ ] Is there **one obvious primary action** per screen?
- [ ] Can the user always see **where they are** (breadcrumb/step/progress) and **what's next**?
- [ ] From every screen: **back, cancel/close, and undo** available?
- [ ] No **modal/wizard/agent** without a visible way to stop or escape?
- [ ] Is **exit as easy as entry** (cancel/delete not buried deeper than sign-up)?
- [ ] Does the flow **survive interruption** — refresh, timeout, back, logout — without losing work?
- [ ] Are there **no unnecessary steps/fields/confirmations** (remove each mentally — still works?)?
- [ ] Are **destructive/irreversible actions** reversible (soft-delete + undo) or clearly scoped
      and hard to trigger by accident?
- [ ] Are there **smart defaults** so most users barely choose?

---

## "Is this button broken or unnecessary?" decision tree

For any control, in order:
1. **Can I state its effect in one plain line?** No → it's a mystery control. Fix or cut.
2. **Does pressing it produce a perceptible effect within 400ms?** No → broken (no-op).
3. **Does another control on this screen do the same thing?** Yes → redundant; cut one.
4. **Does the current task actually need it here, now?** No → move, defer, or remove.
5. **If it's disabled, is the path to enable it discoverable?** No → explain it or remove it.
6. **Is it labeled by outcome (not "OK/Submit/Go") and visually ranked** (primary/secondary/
   destructive)? No → relabel/restyle.

Survives all six → it's a real, well-formed control.

---

## Mental-model & clarity audit

- [ ] Can a **fresh user explain how it works** using only what's on screen — and does their
      explanation match reality? (If not, the system image is lying.)
- [ ] Does the product **reuse conventions** so users arrive with a correct model (Jakob)?
- [ ] Does **visible state reflect actual state** everywhere?
- [ ] Where you broke a convention, can you **name the user benefit** that justifies it?
- [ ] Are **modes** minimized, and where present, **unmistakable**?

---

## Inform-but-not-too-much audit

- [ ] For each on-screen element: does the **current task need it now**? No → defer/collapse/cut.
- [ ] Is guidance shown **at the moment of need, once** — not up front and not repeated?
- [ ] Does each **notification** pass true + timely + actionable?
- [ ] Is depth handled by **progressive disclosure** rather than a wall of text?
- [ ] Could any sentence/tooltip be **removed without changing behavior**? Remove it.

---

## Error & recovery audit

- [ ] Does every error say **what, why, how** — inline, in the user's terms, **without blame**?
- [ ] Is the user's **input preserved** on every error path?
- [ ] Is there **undo** wherever there could be regret (preferred over "Are you sure?")?
- [ ] When confirming, is the **specific object and consequence named** ("Delete *Q3 Forecast*,
      42 records, can't be undone")?
- [ ] Does the form **accept valid human variety** (Postel) instead of rejecting real names/formats?
- [ ] Are failures **surfaced immediately**, at the point of action (no silent/delayed failures)?

---

## The four (five) states audit — every component

- [ ] **Empty** — teaches what goes here, why it matters, one action to fill it (+ template/import
      for enterprise)?
- [ ] **Loading** — acknowledged within 400ms; skeleton/optimistic/progress per wait length?
- [ ] **Partial/edge** — holds with one item, long strings, missing fields, real messy data?
- [ ] **Error** — see error audit above?
- [ ] **Happy path** — the success/end state is deliberately designed and feels good (Peak-End)?

---

## Accessibility & ergonomics audit

- [ ] Meaning never carried by **color alone** (add icon/shape/text; WCAG 4.5:1 text contrast)?
- [ ] **Targets large and well-spaced** (≥44×44pt / 48dp, ≥8dp gaps); whole row/card tappable?
- [ ] **Opposing actions** (accept/deny, save/delete) not tiny and adjacent?
- [ ] Keyboard navigable, sensible **tab order**, visible focus (critical for enterprise)?
- [ ] Respects **motion sensitivity** (no essential info in motion only; reduced-motion honored)?
- [ ] Handles **text expansion / i18n** (English → +up to 300% in other languages)?

---

## Peak-End & delight audit

- [ ] What is the **single best moment** of this experience — is it deliberately designed?
- [ ] What is the **very last thing** the user sees/feels — does it end on a satisfying note?
- [ ] Are **pain peaks** (waits, errors, dead-ends) softened or removed?
- [ ] Is delight kept **out of the way on frequent/repeated tasks** (no delight that slows the
      daily path)?
- [ ] Are the **thresholds (Kano basics) all met** before any delighter was added?

---

## AI audit (in addition to all the above)

- [ ] Is **uncertainty shown honestly** (confidence cones, "this is a draft") — never fake certainty?
- [ ] Can the user **verify, correct, and undo** AI output?
- [ ] Is output **labeled** draft-vs-final, AI-vs-human?
- [ ] Is feedback **streamed within 400ms**; is multi-step work **narrated**?
- [ ] For agents: **start / stop / pause** present; **approval gates** for aggressive/irreversible
      actions; UI **loops and steers**?
- [ ] Were confirmations gated on the **cost of being wrong** (Value Matrix), not added everywhere?
- [ ] Is the copilot **stateful**, right-sized, and backed by promptbooks for common tasks?

---

## Research audit (before/while building — see research-empathy.md)

- [ ] Designing against the **user's** mental model, not my assumptions?
- [ ] Validation came from **commitment/advancement**, not compliments?
- [ ] Feature requests were **understood (motivation dug), not obeyed**?
- [ ] Watched what users **do**, not just what they **say**?

---

## How to deliver a review (tone & format)

When you run these against someone's work:
1. **Lead with what works** — name the strengths honestly (and beware the Aesthetic-Usability
   Effect making you over-praise the pretty bits).
2. **Order findings by user impact** — traps and broken controls first, polish last.
3. For each finding: **what's wrong → which principle → the concrete fix → why it helps the user.**
4. **Recommend, don't just list.** Be the opinionated senior designer: say which fix to do first.
5. **Separate "broken" (must fix) from "could be better" (nice to have)** so priorities are clear.
