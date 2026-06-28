# Negative Prompts — the anti-pattern catalog

Things to **never** do, and how to detect them. The books mostly state positives; this
file inverts them into hard rules so the skill can flag and refuse bad UX. Each entry:
**the anti-pattern → why it harms → the rule → how to detect it.**

Use this in **Review mode** as a checklist of sins, and in **Build mode** as guardrails.

---

## A. Broken & unnecessary controls

**A1. The do-nothing button.** A control that produces no perceptible effect.
- *Rule:* Every control must have an immediate, legible effect (Doherty + feedback).
- *Detect:* Press it. If you can't tell within 400ms that anything happened, it's broken.

**A2. The redundant twin.** Two controls that do the same thing on the same screen.
- *Rule:* One job, one obvious control. Redundancy dilutes focus (Von Restorff) and
  forces a needless choice (Hick).
- *Detect:* List every action a screen offers; if two map to the same outcome, cut one.

**A3. The mystery control.** A button/icon whose effect you can't state in one plain line.
- *Rule:* If it needs a tooltip to be understood, the design failed (Norman). Add a text
  label or remove it.
- *Detect:* Icon-only? Cover the tooltip. Can a new user predict what it does? No → fix.

**A4. The dead control.** A button that's visible but does nothing in this context and
gives no reason why.
- *Rule:* Disable *and explain* (or remove). Gray-out is fine only if the path to enable
  it is discoverable; otherwise it's just a tease.
- *Detect:* Any disabled control with no hint of how to enable it.

**A5. The unnecessary step.** A screen, field, confirmation, or click that adds nothing.
- *Rule:* Conserve complexity (Tesler). Every step must earn its place.
- *Detect:* Remove it mentally — does the task still complete correctly and safely? Then
  it was unnecessary.

---

## B. Dead-ends & broken flow (no exit room)

**B1. The trap.** A screen, modal, wizard, or state with no visible way back, out, or undo.
- *Rule:* Every room has a door. Provide back, cancel, close, and undo everywhere. (ISO
  Controllability + Norman reversibility.)
- *Detect:* Land on each screen cold — can you leave without the browser back button or a
  page reload?

**B2. The roach motel.** Easy to get into, hard to get out (sign-up in one click, cancel
buried five screens deep).
- *Rule:* Exit must be as easy as entry. This is also a dark pattern (see D).
- *Detect:* Count the clicks to undo/cancel/delete vs. the clicks to start. Asymmetry = sin.

**B3. The point of no return.** An irreversible action with no undo and no real warning.
- *Rule:* Make it reversible (soft-delete + undo), or make it genuinely hard to trigger
  accidentally and clearly labeled by *effect*.
- *Detect:* For every destructive action, ask "can the user get their state back?"

**B4. The lost-work flow.** Losing progress on refresh, timeout, back, or error.
- *Rule:* Autosave and preserve input. Never make a user retype what the system had.
- *Detect:* Refresh mid-task; navigate away and back; trigger an error — is input preserved?

---

## C. Over-informing & notification abuse

**C1. The crier-wolf.** Notifications that aren't true, timely, or actionable, training the
user to ignore all of them (then the one that matters is missed).
- *Rule:* A notification must pass all three: true, timely, actionable. Silence is a feature.
- *Detect:* For each alert, which of the three does it fail? Any fail → kill or downgrade it.

**C2. The wall of text / data dump.** Showing everything "just in case."
- *Rule:* As little as possible, as much as necessary. Chunk and progressively disclose.
- *Detect:* For each element, does the *current task* need it now? No → defer/collapse/cut.

**C3. The over-explainer.** So much helper text, tooltips, and onboarding that signal drowns.
- *Rule:* Explain at the moment of need, once. Trust recognition and conventions to carry
  the rest. (Especially acute for AI — see `ai-ux.md`.)
- *Detect:* Could a competent user reach the goal faster if half the guidance vanished?

**C4. The nag.** Repeated interruptions (rate us, enable notifications, upgrade) that serve
the business, not the task.
- *Rule:* Ask once, at a relevant moment, with an easy permanent "no."
- *Detect:* Does this popup protect/help the user, or just the provider's metrics?

---

## D. Dark patterns (categorical bans — never, regardless of metrics)

From Yablonski's ethics chapter + Kauer-Franz. These manipulate users against their own
interest. They are banned even when they "work."

- **Confirm-shaming:** guilt-tripping decline copy ("No thanks, I hate saving money").
- **Forced action / privacy zuckering:** demanding access or data unrelated to the task
  (Instagram forcing contact access).
- **Sneaking:** hidden costs, pre-checked add-ons, items slipped into the cart.
- **Roach motel:** easy in, hard out (see B2).
- **Fake urgency / scarcity:** invented countdowns and "only 1 left" lies.
- **Misdirection / disguised ads:** styling content to be mistaken for navigation, or ads
  as content (banner-blindness exploitation).
- **Trick wording / double-negative buttons:** ambiguous "Cancel" that could mean two things.
- *Rule:* If a design benefits the business by deceiving or coercing the user, it's out.
  Use friction *for* the user (prevent errors, protect privacy), never *against* them.
- *Detect:* Ask "would I be comfortable explaining this design choice to the user's face?"
  No → it's a dark pattern.

---

## E. Error-handling sins

**E1. The blamer.** "An error occurred." / "Invalid input." / "Something went wrong."
- *Rule:* State **what** is wrong, **why**, and **how to fix it**, inline at the field.
  "The return date must be after the departure date" — not "invalid date." Treat user
  actions as approximations of intent, not crimes.
- *Detect:* Does the message let the user fix it without guessing or contacting support?

**E2. The confirmation crutch.** Using "Are you sure?" as the primary safety net.
- *Rule:* Reversibility beats confirmation. Confirmations catch almost no real slips
  because the user confirms the action they *think* they want.
- *Detect:* Is the only protection a dialog? Add undo / soft-delete instead or as well.

**E3. The silent failure.** An action fails and the user never finds out (or finds out 24
hours later, when they can't remember what they did).
- *Rule:* Errors must be immediate and visible at the moment and place of action.
- *Detect:* Force every failure path — network drop, timeout, validation — is it surfaced now?

**E4. The strict gatekeeper.** Rejecting valid human variety (hyphenated names, non-Western
name order, spaces in card numbers, varied phone/address formats).
- *Rule:* Postel's Law — be liberal in what you accept, normalize it yourself. Ask only
  for what's necessary.
- *Detect:* Try unusual-but-valid inputs. Does the form insult the user for being real?

---

## F. AI-specific anti-patterns (full treatment in `ai-ux.md`)

**F1. The overconfident oracle.** Presenting probabilistic output as certain fact, no
uncertainty shown, no way to verify.
- *Rule:* Show confidence honestly (e.g., forecast cones). Always provide a path to verify,
  correct, and undo. Label whether the AI is *creating* or just *drafting*.

**F2. The runaway agent (Sorcerer's Apprentice).** An autonomous agent with no stop, pause,
or approval gate — racking up cost or taking irreversible actions.
- *Rule:* Async **start / stop / pause** controls are mandatory. Human-in-the-loop approval
  for any aggressive or irreversible action. The agent has an exit room, always.

**F3. The hallucination-as-truth.** Plausible-but-wrong AI output passed straight to the
user with no human verification step.
- *Rule:* "AI accuracy is bullshit" — assume it can be confidently wrong. Mandatory
  human-in-the-loop review for anything consequential.

**F4. The mislabeled magic.** Selling "AI creates X for you" when it really produces a rough
draft needing edits → sets the user up for disappointment (a bad Peak-End memory).
- *Rule:* Set expectations to match reality: "draft," "suggestion," "starting point."

**F5. The pointless confirmation.** Adding restate/confirm steps where being wrong costs the
user nothing — friction with no payoff.
- *Rule:* Gate confirmations on the *cost of being wrong* (the Value Matrix), not on every action.

---

## G. Research & decision sins (from The Mom Test)

**G1. Fishing for compliments.** "Do you like it? Would you use this?" → collects flattery,
not truth, and produces false positives you build the wrong thing on.
- *Rule:* Talk about the user's life and past behavior, never pitch your idea. (See
  `research-empathy.md`.)

**G2. Obeying feature requests literally.** Building exactly what a user asked for without
digging into the motivation behind it.
- *Rule:* Ideas and requests are to be *understood, not obeyed.* Ask "why do you want that?
  what would it let you do? how do you cope now?"

**G3. Mistaking politeness for validation.** Treating "that's cool, let me know when it
launches" as a signal.
- *Rule:* Only commitment (time, reputation, money) and advancement count. Compliments are
  "the fool's gold of customer learning."

---

## Quick reference — the seven cardinal sins

1. A control that does nothing, duplicates another, or can't be explained in one line.
2. A screen, flow, or agent with no exit, back, or undo.
3. An irreversible action with no undo and no real safeguard.
4. A notification or message that isn't true, timely, and actionable.
5. An error message that blames the user instead of helping them recover.
6. Any pattern that deceives or coerces the user for the business's gain.
7. An AI that hides its uncertainty, acts without consent, or can't be stopped.
