# UX Writing — voice, microcopy, and "inform but not too much"

Words are interface. The same screen succeeds or fails on its labels, errors, and empty
states. Copy is where "always inform but not too much," "exit room," and "comfortable and
intuitive" actually live.

---

## The voice

- **Clear before clever.** The user is mid-task, not reading for pleasure. If a witty line
  costs a millisecond of comprehension, cut it. (Clever ≈ self-indulgent — Norman.)
- **Plain, human, calm.** Write like a competent colleague, not a system log or a marketer.
  "Please" and "thank you" cost nothing and increase engagement (ISO User Engagement).
- **Match the user's vocabulary, not yours.** Use the words your users use. *Exception for
  internal/enterprise tools:* domain jargon is correct and often preferred — accountants
  want "reconcile," not "match up your money" (see `enterprise.md`).
- **Consistent terms.** One concept = one word, everywhere. Don't alternate "remove /
  delete / discard / clear" for the same action; the user thinks they're different.

---

## Labels (buttons, links, controls)

- **Label by outcome, not mechanism.** The button says what *happens*: "Save changes,"
  "Send invite," "Delete project" — not "Submit," "OK," "Go."
- **Never two meanings of "Cancel."** The classic trap: a "Cancel your subscription?" dialog
  with buttons "Cancel" and "Cancel Subscription." Label the safe path by its effect:
  **"Keep subscription"** vs "Cancel subscription." Each button states its own outcome so it
  reads correctly *without* the question.
- **Verbs for actions, nouns for navigation.** "Create report" (action) vs "Reports" (place).
- **Icon + text** for anything non-universal. Icon-only is allowed only for truly universal
  glyphs (search, close, menu) — everything else gets a label (recognition over recall).
- **Make primary and destructive distinct.** The destructive button is labeled by its
  destructive effect and visually separated from the safe default.

---

## The "inform but not too much" calibration

The hardest balance. Use this ladder — escalate only as far as the moment requires:

1. **Nothing.** If the convention carries it, say nothing. Don't label the obvious.
2. **In-context hint.** A placeholder, a helper line, an "i" tooltip at the field's edge —
   available on demand, not shouting. Good for "why we ask" and format rules ("at least 10
   characters, 1 number").
3. **Inline message.** Surfaced at the point and moment of need (a validation note as they
   type). Disappears when resolved.
4. **Interruption (modal/dialog).** Reserved for preventing real harm to the user (confirm a
   destructive delete) — never for the provider's benefit. An interruption that doesn't
   protect the user is a nag.

Rules of thumb:
- **Explain at the moment of need, once.** Not up front, not repeatedly.
- **Progressive disclosure for depth.** Short answer visible; "Learn more" for the rest.
- **Cut every word that doesn't change what the user does.** If removing a sentence doesn't
  change behavior, remove it.
- **Don't over-explain confidence or internals** (especially AI — see `ai-ux.md`). Tell them
  what they need to decide and act, not the whole mechanism.

---

## Error messages (the blame-free formula)

Three parts, always, inline at the source:
1. **What** went wrong — in the user's terms.
2. **Why** — the cause, briefly.
3. **How** to fix it — the concrete next action.

- Bad: "Error. Invalid input." / "Something went wrong." / "Error 0x80."
- Good: "The return date must be after the departure date. Pick a later date."
- Good: "We couldn't reach the server. Your work is saved — try again in a moment."

Principles: never blame ("you entered an invalid…"); treat the action as an approximation of
intent; preserve the user's input; offer the fix, not just the diagnosis; for system faults,
reassure that their data is safe.

---

## Empty states (the most wasted screen)

An empty state is an onboarding opportunity, not a blank. Include:
- **What this is** and what will appear here.
- **Why it's valuable** (one line).
- **One primary action** to fill it ("Create your first report").
- Optional warmth/personality (low-stakes moment — fine to delight here).

Enterprise empty states often need a *sample/template* and a path to import existing data —
see `enterprise.md`.

---

## Notifications & system messages

Every notification must pass all three or it shouldn't fire:
- **True** — accurate and not misleading.
- **Timely** — useful now, not noise later.
- **Actionable** — the user can do something with it.

- Prefer **inline, transient** (toast) for confirmations; **persistent** only for things that
  need attention later; **interruptive** only to prevent harm.
- Confirmation copy should restate what happened and offer **undo**: "Project deleted. **Undo**."
- Group and summarize; don't fire ten notifications for one batch action.
- Respect silence. The best notification is often the one you didn't send.

---

## Confirmations & destructive actions

- Prefer **undo over confirm** (reversibility beats dialogs — Norman). "Deleted. Undo."
- When you must confirm, **name the specific object and the specific consequence**: "Delete
  *Q3 Forecast*? This removes 42 records and can't be undone." Generic "Are you sure?"
  confirms nothing meaningful.
- The dialog's buttons follow the label rules: outcome-named, safe default obvious,
  destructive action distinct.

---

## Microcopy checklist (run on any screen)

- [ ] Does every button say what *happens* when pressed?
- [ ] Is "Cancel"/"OK" ever ambiguous here? Rewrite by outcome.
- [ ] Does every error say what, why, and how — without blaming?
- [ ] Is the user's input preserved on every error?
- [ ] Does each empty state teach, motivate, and offer one action?
- [ ] Does each notification pass true + timely + actionable?
- [ ] Could any sentence be cut without changing what the user does? Cut it.
- [ ] One word per concept, consistently, in the user's (or domain's) vocabulary?
- [ ] Is there an undo wherever there could be regret?
