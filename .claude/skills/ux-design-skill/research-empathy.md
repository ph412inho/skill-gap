# Research & Empathy — building an accurate user mental model

You cannot design a good experience for a user you've imagined. This file is about getting the
**truth** about real users so the mental model you design against is *theirs*, not yours.
Primary source: Fitzpatrick, *The Mom Test* (+ Norman's "the designer's model must come from the
user," Nudelman's "reject synthetic users").

Use this in **Research mode** — when deciding *what* to build, validating a direction, or
diagnosing why something isn't landing.

---

## The core problem: bad data is worse than no data

- People lie to you — not maliciously, but to be polite, to protect your feelings, and because
  they're optimistic about their hypothetical future selves.
- These lies produce **false positives**: you hear "I'd love that," build it, and no one comes.
  "Doing it wrong is worse than doing nothing at all."
- It's **your job** to fix the conversation, never the user's job to volunteer the truth.
- Division of labor: **they own the problem, you own the solution.** Don't let them design;
  don't tell them their problem.

---

## The three rules of The Mom Test

Pass these and even your mother can't lie to you.

1. **Talk about their life, not your idea.** Don't reveal what you're building — if they don't
   know your idea, they can't flatter it. Ask about their actual world.
   - DO: "What's the last thing you did in [the relevant area]? Walk me through it."
   - DON'T: "Would you use an app that does X?" (invites a protective lie)

2. **Ask about specifics in the past, not generics or the future.** The future is "an
   over-optimistic lie"; opinions are worthless. Real signal lives in concrete past behavior.
   - DO: "Talk me through the last time that happened." "What did it cost you?" "What have you
     tried?"
   - DON'T: "Would you ever…?" "Do you usually…?" "How much would you pay?"

3. **Talk less, listen more.** Every minute you talk, you bias them and lose a "privileged
   glimpse into their mental model." Ask a short question, then be quiet.
   - DON'T pitch, interrupt to correct, or fish for approval.

---

## Good data vs. bad data

**Bad data (warning signs):**
- **Compliments** — "that's so cool," "I love it." The fool's gold of customer learning;
  entirely worthless. Deflect and dig: "How do you deal with this today?"
- **Fluff** — generics ("I usually…"), futures ("I would…"), hypotheticals ("I might…").
  Anchor it to a real instance: "When did that last happen? Walk me through it."
- **Ideas / feature requests** — note them, but **understand, don't obey.** Dig the motivation:
  "Why do you want that? What would it let you do? How are you coping now?" (The team that asked
  for "analytics" actually just wanted to keep their clients happy — building the literal request
  would have been 90% wrong.)

**Good data (a meeting that worked):**
- **Facts** — concrete specifics about what they actually do and why.
- **Commitment** — they give up something they value: time, reputation, or money.
- **Advancement** — they move to the next real step.
- **Loving bad news:** a lukewarm "eh, I'm not sure I'd use it" is *excellent* data — a clear
  signal to stop. Best = learning, not selling.

---

## Commitment & advancement (real signal vs. polite lie)

- There's no meeting that just "went well" — it **succeeded or failed** based on whether they
  gave a currency: **time** (real next meeting, feedback on a prototype, a trial), **reputation**
  (an intro to peers or their boss, a testimonial), or **cash** (LOI, pre-order, deposit).
- Polite lies that feel like progress: "Looks great, let me know when it launches" (= a stall),
  "I'd definitely buy that" (the false positive that has killed startups).
- **It's not a real lead until you've given them a clear chance to reject you.** If you don't
  know the next step, the meeting was pointless.

---

## Asking the scary questions

- Don't retreat into safe, trivial questions. Ask the one **whose answer could disprove your
  idea.** "You should be terrified of at least one question in every conversation."
- Don't premature-zoom on the most *interesting* problem; find the *deadliest* one (the teachers
  are overloaded — but the schools have no budget).
- Conversations validate **market risk** (do they want it / will they pay) far better than
  **product risk** (can you build it / will they keep using it). Heavy product risk → start
  building and testing earlier.

---

## From research to an accurate mental model (Norman's loop)

The point of all this is to build the **user's** mental model into the product:

- The designer's conceptual model must be *derived from how users actually think*, then expressed
  faithfully through the system image (see `principles.md` #1).
- Watch real behavior ("show, not tell") — problems are "where the problems really are, not where
  the customer thinks they are."
- **Reject synthetic users / AI personas** (Nudelman): replacing real studies with AI models
  "guarantees you'll build for robots, not customers." The messy human truth is the asset.
- Map the journey to find the emotional **peaks and the end** (Peak-End) — research tells you
  *which* moments carry the memory, so you know where to spend the delight budget.

---

## Test the design, not your ego

- In usability tests, **watch what users do, not what they say** — the Aesthetic-Usability Effect
  means a pretty prototype draws compliments that mask real problems.
- Run small and early and often (RITE / rapid iterative): each round changes the design. The
  output is a better product, not a report.
- A fresh user explaining your product back to you reveals whether the system image is teaching
  the right model (see `checklists.md`).

---

## Research quick test

- [ ] Did I avoid mentioning my idea until after I learned about their life?
- [ ] Did I ask about specific past events, not opinions or the future?
- [ ] Did I talk less than they did?
- [ ] Did I dig into the *motivation* behind every request, instead of obeying it?
- [ ] Did I get a commitment or advancement (time/reputation/cash) — or just compliments?
- [ ] Did I ask at least one question that could have disproven my idea?
- [ ] Am I designing against the *user's* mental model, or my own assumptions?
