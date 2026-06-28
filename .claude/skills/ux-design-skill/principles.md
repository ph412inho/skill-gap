# Core Principles (in depth)

Each principle: **what it is → why (cross-book) → DO → DON'T → the test**. These are
the load-bearing ideas. Patterns and copy in other files are applications of these.

---

## 1. Match the user's mental model

**What.** The user builds a mental model of how your product works *only* from what
they can see, touch, and read — Norman calls this the **system image**. You (the
designer) never speak to the user directly; you speak through the system image. If
your model is coherent in your head but the system image is incomplete or
contradictory, the user forms a *wrong* model and fails — and it's your fault.

**Why.** Norman's three models (design model / user's model / system image) +
Jakob's Law (users' models are built from every *other* product they've used). The
two root causes of almost every bad product: **poor conceptual model + lack of
visibility.**

- **DO:** Make the principles of operation observable. Let visible state reflect
  actual state. Reuse conventions so the user arrives with a correct model already
  (a trash icon means delete everywhere — don't reinvent it).
- **DON'T:** Project a false model. Norman's fridge has two dials labeled "freezer"
  and "fresh food" but one thermostat — the system image *lies* about how it works,
  so the task becomes impossible. Don't label two things as independent when they aren't.
- **TEST:** Ask a fresh user to explain how it works using only what's on screen. If
  their explanation diverges from reality, the system image is failing — close the gap.

---

## 2. Afford and signify

**What.** An **affordance** is what an object lets you do; a **signifier** is the
visible cue that tells you *where and how* to do it. (In the 1988 Norman this is
"natural signals / visible clues.") Good design makes the right action look like the
only obvious one.

**Why.** Norman's affordances + constraints; reinforced by Von Restorff (the thing
that differs gets noticed) and Fitts's Law (big, reachable targets get hit).

- **DO:** Make clickable things look clickable and primary actions visually dominant.
  Use the four constraint types to remove wrong options: **physical** (can't do it
  wrong), **logical** (only one thing left to do), **cultural** (red = stop),
  **semantic** (meaning rules it out). A flat plate affords only pushing.
- **DON'T:** Strip signifiers for aesthetics (the elegant glass door you can't tell
  how to open). Don't make the user discover the right action by trial and error.
- **TEST:** Can the user act correctly *just by looking* — no label, no instruction?
  If a control needs a sign, the hardware is faulty.

---

## 3. Feedback within 400ms, always

**What.** Every action must produce an immediate, legible response that says *it
worked* and *what state you're in now*. Below ~400ms (the **Doherty Threshold**),
user and system stop waiting on each other and the user enters flow.

**Why.** Norman's feedback + gulf of evaluation + Doherty Threshold. "Imagine
drawing with a pencil that leaves no mark."

- **DO:** Acknowledge within 400ms even if the result isn't ready — use optimistic
  UI, skeletons, spinners with context, progress bars (a progress bar makes a wait
  tolerable *regardless of accuracy*). For >10s, show an estimate + what's happening.
- **DON'T:** Leave an action with no visible effect. Don't give *misleading* feedback
  (Norman's bathroom fan whose indicator light turned **off** while it ran). Beware
  responses so fast the change is missed — sometimes add a beat so the user perceives it.
- **TEST:** After I act, within 400ms can I tell it registered, and after completion
  can I tell the new state? How much effort to know "did it work"? High effort = wide
  gulf of evaluation.

---

## 4. Respect conventions (Jakob's Law)

**What.** Users spend nearly all their time on *other* products, so they expect yours
to work the same way. Familiarity is a feature.

**Why.** Jakob's Law + Norman's "standardize when all else fails."

- **DO:** Start from established patterns and a design system. Put things where users
  already look (logo top-left → home, cart top-right). Innovate only where the novelty
  delivers clear, tested value, and let users opt into big changes gradually.
- **DON'T:** Redesign drastically overnight (Snapchat 2018 → revolt). Don't be novel
  for novelty's sake. "If you think it's clever and sophisticated, beware — it's
  probably self-indulgence" (Norman).
- **TEST:** Does this differ from the convention? If yes, can you name the user benefit
  that justifies the relearning cost? No → conform.

---

## 5. Conserve complexity; minimize choices and steps (Tesler's + Hick's)

**What.** Every system has an irreducible complexity that can only be *moved* between
user and builder — **Tesler's Law**. Move it onto your side. And decision time grows
with the number/complexity of options — **Hick's Law**.

**Why.** Tesler + Hick + Occam + Norman's "simplify the structure of tasks." Email
auto-fills the sender, suggests recipients, defaults "shipping = billing" — the system
eats the complexity.

- **DO:** Reduce options to what's needed *now*; reveal the rest progressively. Provide
  smart defaults (most users never change them). Pre-fill, infer, and pre-compute. Break
  long tasks into clear steps. Highlight the recommended option.
- **DON'T:** Dump every option at once. **But don't over-simplify into ambiguity** —
  icon-only nav with no labels just moves the cost to the user's memory. Don't make
  engineering's job easier by shipping the complexity to a million users.
- **TEST:** Count the choices and steps to the goal. For each, ask "can the system
  decide or remember this instead of the user?" Every "yes" is friction to remove.

---

## 6. Recognition over recall (knowledge in the world)

**What.** Put the knowledge needed to act *in the world* (visible labels, state, lists
to pick from), not *in the user's head* (memorized codes, hidden modes).

**Why.** Norman's knowledge in the head vs in the world; Miller's Law (working memory
holds ~4 chunks, not really 7) — don't make users hold things across screens.

- **DO:** Show, don't make them recall. Offer pickers over free recall. Keep prior
  context visible. Chunk dense information (group, space, divide) to lower cognitive load.
- **DON'T:** Require a value from a previous screen to be retyped here. Don't hide modes.
  Don't rely on the user memorizing arbitrary sequences ("dial 60 to call back — why 60?").
- **TEST:** People recognize a penny but can't draw it. Does any step force *recall*
  rather than *recognition*? Move it into the world.

---

## 7. Design for error (the most under-applied principle)

**What.** "If an error is possible, someone will make it." Don't think of the user as
making errors — think of their actions as **approximations of what they intended**.
Design so those approximations land safely.

**Why.** Norman's error-tolerant design; slips (right goal, wrong action) vs mistakes
(wrong goal). Confirmations and warnings are weak; reversibility is strong.

- **DO (Norman's four):** (1) understand and remove the *causes* of errors;
  (2) make actions **reversible / undoable**, or make irreversible ones hard to reach;
  (3) make errors easy to detect and correct; (4) don't punish — guide. Prefer
  "move to Trash + Undo" over "Are you sure?".
- **DON'T:** Rely on confirmation dialogs — the user confirms the *action*, not the
  *mistake* (they meant to delete, just the wrong file). Don't rely on warnings — in a
  real emergency every alarm fires at once and users disable nuisance ones. Don't build
  a forcing function so annoying users defeat it (the seatbelt interlock that got
  ripped out).
- **TEST:** For every destructive or costly action: is it reversible? If not, why not,
  and is the barrier to *doing it accidentally* high enough? Can the user recover their
  work after any failure (autosave, versioning)?

---

## 8. Protect the peak and the end (Peak-End Rule)

**What.** People judge an experience by its emotional **peak** and its **end**, not the
average of every moment. One great moment and a clean finish outweigh a mediocre middle;
one painful peak poisons the memory (negativity bias makes bad peaks louder).

**Why.** Yablonski's Peak-End + Zeigarnik/Goal-Gradient (people are pulled to finish).

- **DO:** Find the emotional peaks with a journey map. Engineer delight into the most
  intense moment and the *final* moment (a satisfying success state, a warm confirmation,
  Spotify Wrapped). Mask or soften pain peaks (real-time validation, a graceful wait).
- **DON'T:** Spend the delight budget on the middle and let the user exit on a flat or
  broken note. Don't add humor to a *bad* moment and make it worse.
- **TEST:** What is the single best moment, and what is the very last thing the user
  sees/feels? Are both deliberately designed?

---

## 9. Inform, don't overwhelm

**What.** "As little information as possible, but as much as is necessary to perform the
task correctly" (ISO 9241 / Kauer-Franz). Self-descriptive, not noisy.

**Why.** Suitability-for-task + self-descriptiveness principles; Miller's chunking;
the ethics chapter's warning that notifications are a variable-reward slot machine.

- **DO:** Show what the current task needs, when it's needed. Use progressive disclosure
  for the rest. Make notifications true, timely, and actionable. Provide breadcrumbs and
  progress so users always know where they are.
- **DON'T:** Display every field and data point "just in case." Don't notify for the
  business's benefit. Don't explain so much that the signal drowns (over-explaining AI is
  its own anti-pattern — see `ai-ux.md`).
- **TEST:** For each element on screen: does the current task need it now? If no → defer,
  collapse, or cut. For each notification: is it true, timely, and actionable?

---

## 10. Beauty earns trust — but never hides problems (Aesthetic-Usability Effect)

**What.** Users perceive attractive interfaces as more usable, form that judgment in
~50ms, trust them more, and forgive their minor flaws.

**Why.** Yablonski's Aesthetic-Usability Effect + Kano model (delighters decay into
expectations over time, so keep raising the bar).

- **DO:** Invest in visual craft, consistency, spacing, and hierarchy — it's not
  decoration, it's trust and credibility. "Less, but better" (Rams).
- **DON'T:** Let beauty *mask* real usability problems — polish can hide issues so well
  they pass usability tests. In testing, watch what users *do*, not what they say. And
  beauty never excuses a broken flow.
- **TEST:** Strip the styling mentally — is the structure still usable? Beauty should
  amplify a sound design, never compensate for a broken one.

---

## How to combine them

When principles conflict, this is the priority order for most products:

1. **Don't trap or harm the user** (error recovery, exits, no dark patterns) — safety first.
2. **Let them figure out what to do and see what's happening** (mental model, feedback).
3. **Get them to the goal with the fewest steps** (conserve complexity).
4. **Make the peak and end feel good** (delight, polish).

Delight never comes before clarity or safety. A beautiful product that traps or
confuses the user is a failed product.
