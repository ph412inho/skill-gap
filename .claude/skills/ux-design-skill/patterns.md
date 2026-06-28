# Pattern Library — flow, delight, states, interaction

Reusable patterns that apply the principles. Organized by what you're trying to achieve.
Each: **when to reach for it → the pattern → the why.** Patterns are defaults, not laws —
override when a principle says so.

---

## 1. Smooth flow (get the job done)

**Goal-gradient & momentum.** People accelerate as they near a goal (Zeigarnik +
Goal-Gradient). 
- Show progress (steps, %, checklist). Give a small head start (a pre-checked first step,
  "2 of 5 done"). Order steps easy→hard to build momentum.

**One primary action per screen.** Each screen should have a single obvious next step
(Von Restorff makes it dominant; Hick keeps alternatives quiet). Secondary actions are
visually subordinate; tertiary actions are tucked away.

**Progressive disclosure.** Show the common 80% now; reveal advanced options on demand
(Tesler + Hick). Stripe-style "more options," accordions, "advanced settings." Never make
the novice pay for the expert's power, or hide the expert's power from them entirely.

**Defaults that do the work.** Pre-fill, pre-select the recommended option, remember last
choices, infer from context ("shipping = billing"). Most users never change a default, so
the default *is* the design.

**No premature gates.** Don't force account creation, payment, or config before the user
has felt any value. Let them do the thing first; ask for commitment at a moment that has
earned it.

**Forgiving input.** Accept varied formats and normalize server-side (Postel). Inline
validation as they go, not a wall of red on submit. Real-time success ticks reduce the
pain peak of errors.

---

## 2. Perceived performance (mask the wait)

The wait is often unavoidable; the *perception* is designable (Doherty Threshold).

| Wait | Pattern |
|---|---|
| < 400ms | Do nothing — it feels instant. |
| 0.4–1s | Subtle acknowledgment: button state change, micro-spinner. |
| 1–10s | Skeleton screens (Instagram), optimistic UI (show the result before the server confirms), blur-up images, contextual spinner ("Generating your summary…"). |
| > 10s | Progress bar + time estimate + what's happening + a way to keep working or cancel. |

- **Optimistic UI:** assume success, show the result immediately, reconcile in the
  background, gracefully roll back on failure (with a clear message). Great for likes,
  comments, sends.
- **Skeleton over spinner** for content layouts — it sets the mental model of what's coming.
- A progress bar makes waiting tolerable *even when it's not accurate.* Motion buys patience.
- **Sometimes add a beat:** a result that appears too instantly can read as "it didn't do
  anything" or "it didn't try." A brief, honest pause can increase trust (e.g., a security
  check that visibly "works").

---

## 3. The four states every component must design

Most "broken" UIs are missing three of these. Design all four, every time:

1. **Empty** — first use, no data yet. Not a blank void: explain what goes here, show the
   value, give one clear action to fill it. (Enterprise empty states: see `enterprise.md`.)
2. **Loading** — see perceived-performance patterns above. Never a frozen screen.
3. **Partial / one item** — does the layout hold with a single row, a long name, a missing
   avatar? Design for the messy real data, not the demo data.
4. **Error** — what failed, why, how to recover, and the user's work preserved. Inline,
   specific, blame-free (see `ux-writing.md`).

Plus the happy path = five total. Teams design only the happy path; the craft is in the
other four.

---

## 4. Microdelight (the peak)

Delight is the deliberate engineering of the emotional peak and end (Peak-End), *after*
the basics work — never instead of them (Kano: thresholds first, then delighters).

- **Reward completion.** A satisfying success state at the end of a flow — a confirmation
  that feels warm, a subtle celebratory motion, a clear "you're done." This is the *end*
  the user will remember.
- **Personality in low-stakes moments.** Empty states, 404s, and confirmations can carry
  warmth and voice — but **never** add humor to a high-stress or failure moment; it makes
  a bad peak worse.
- **Responsive micro-interactions.** A toggle that animates, a button that depresses, a
  list item that slides in — these are *feedback* doing double duty as delight. They confirm
  the system heard you.
- **Earned surprise.** Spotify Wrapped, a milestone badge, a "first project created" moment.
  Surprise works when it follows real effort/value, not when it's confetti for nothing.
- **Delighters decay.** Today's delight becomes tomorrow's expectation (Kano). Keep a small
  ongoing budget for raising the bar; don't rest on one trick.

Rule: a microdelight that *slows the user down* on a frequent task is a defect, not a
delight. Delight the rare, meaningful moments; stay out of the way on the repeated ones.

---

## 5. Spaces & "exit rooms" (comfort, escape, control)

Think of each screen as a room. A comfortable room has a clear purpose, room to breathe,
and an obvious door.

- **Always a visible exit.** Back, close, cancel, undo. No modal without an X and an
  escape; no wizard without "back"; no destructive action without undo. (See `negative-prompts.md` B.)
- **Whitespace is structure, not waste.** Space groups related things (Law of Proximity /
  Common Region), creates hierarchy, and lowers cognitive load. Crowding everything signals
  "this is hard." Breathing room signals "this is under control."
- **Let users pause and resume.** Long or interruptible tasks should survive a context
  switch (ISO Controllability). Save drafts; remember where they were.
- **Reversible exploration.** Provide a safe place to try things — undo, a sandbox/preview
  mode, "discard changes." Users explore confidently only when retreat is free.
- **Reduce modes, or make them loud.** Mode errors (the same action meaning different things)
  are inevitable when controls do double duty. Minimize modes; when you must have them, make
  the current mode unmistakable.

---

## 6. Attention & emphasis (guide the eye)

- **One focal point per view** (Von Restorff). Emphasize with size, weight, color, position,
  or space — but **never color alone** (color-blind users; meet WCAG 4.5:1). Add shape/icon/
  text redundancy.
- **Don't over-emphasize.** Five focal points = zero focal points. If everything shouts,
  nothing is heard.
- **Visual hierarchy = reading order.** The most important thing should be the first thing
  the eye lands on. Test by squinting: what stands out should be what matters.
- **Avoid ad-like styling** for real content (banner blindness) — users have learned to skip
  anything that looks like an ad.

---

## 7. Reach & ergonomics (Fitts's Law)

- **Big targets, generous spacing.** Exceed the minimums (44×44pt touch, 48dp Material,
  ≥8dp gaps). The whole row/card is the target, not just the tiny icon.
- **Put actions where hands are.** Thumb zones on mobile; near the last form field for
  submit; screen edges and corners are "infinitely large" targets (the cursor stops there).
- **Never put opposing actions tiny and adjacent.** Accept/deny, save/delete close together
  = mis-taps. Separate destructive actions, and weight them differently.

---

## 8. Trust & credibility (the first 50ms)

- **Aesthetic-Usability:** visual polish, consistency, and alignment read as competence and
  buy forgiveness for small flaws — invest in craft.
- **Consistency, internal and external:** same concept → same word, icon, and behavior
  everywhere; match platform conventions.
- **Show the work where trust matters:** for slow or consequential operations, a visible,
  legible process ("Checking 3 sources… Verifying…") builds confidence — sometimes worth a
  deliberate beat (see perceived performance).

For AI-specific trust, control, and uncertainty patterns, go to `ai-ux.md`.
