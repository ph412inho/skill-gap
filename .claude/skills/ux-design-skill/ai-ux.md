# AI / LLM UX — trust, uncertainty, control, and exit rooms

AI products break the classic assumptions: output is **probabilistic, not
deterministic**, the system can be **confidently wrong**, and agents can **act on their
own**. The fundamentals still apply (mental model, feedback, error recovery) — this file
adds what's specific. Primary source: Nudelman, *UX for AI*.

---

## The governing mindset

- **"AI accuracy is bullshit."** Data-science metrics (accuracy/precision/recall) don't map
  to user value. Design around the **cost of being wrong**, not a single accuracy number.
- **Decide with the Value Matrix.** For any AI decision, weigh four outcomes — true positive,
  true negative, false positive, false negative — by their *real-world value/cost to the
  user and business*. This tells you how aggressive vs. conservative the model and the UX
  should be, and whether to add a confirmation step at all.
- **Augmented intelligence, not artificial.** The biggest wins come from *augmenting* a human,
  not replacing them. Keep the human in the loop as a feature, not a fallback. "Presuming AI
  will tell experts how to do their job is a red flag."
- **Set expectations to match reality.** Be explicit whether the AI is **creating** a finished
  thing or **drafting** a starting point. Mislabeling sells magic, delivers a draft, and burns
  the Peak-End memory.

---

## Uncertainty & confidence (don't fake certainty)

- **Show uncertainty honestly.** For forecasts, draw the **confidence cone** that widens
  further out, a "now" marker, solid line = actuals, dashed = prediction. The user should
  *see* that further-out = less certain.
- **Never present probabilistic output as fact.** Give a path to verify (sources, "show
  reasoning," citations) and to correct.
- **Watch for "obvious hallucination."** A model can produce output that fits the data but
  violates reality (chlorine rising over shelf life; a fact that's plausibly false). Build in
  a human/SME check for anything that looks confident and consequential — assume the model can
  be smoothly, fluently wrong.
- **Don't over-explain.** Transparency is not a data dump of token probabilities. Surface the
  confidence and reasoning the user needs to *decide and act*; tuck the rest behind progressive
  disclosure.

---

## The seven LLM interaction patterns (Nudelman's pattern language)

These keep the LLM "our servant." Reach for them by situation:

1. **Restating** — echo back what the AI understood before/as it acts ("Showing results for:
   2017 *(order date)*"). Use when a false positive is costly; skip when being wrong is
   trivial. Don't add a "Did you mean?" when input was already guaranteed valid.
2. **Auto-Complete** — offer correct concepts/vocabulary *as the user types*, drawn from prior
   queries and the live data fields; flag valid vs. unmatched terms inline. Prevents
   miscommunication before it happens.
3. **Talk-Back** — a richer restating: the AI explains *what went wrong and why*, asks
   clarifying questions, suggests alternative strategies. Needs chat space to breathe; don't
   cram multi-turn reasoning into one field.
4. **Initial Suggestions** — show smart starting prompts *before* the user does anything,
   tuned to their data/history (not generic boilerplate). Lets users start with zero typing.
5. **Next Steps** — *after* a result, suggest the likely next question by analyzing the
   returned data (trends, anomalies, gaps). Surfaces insights the user didn't know to ask for.
6. **Regen Tweaks** — for *creative* generation (hot temperature, output is disposable), give
   one-click variation controls (vary subtle/strong, region, parameters). Don't apply
   conversation-continuation to a creative-variation flow, or vice versa — they're opposite.
7. **Guardrails** — constrain what the model will produce. But **assume guardrails can be
   jailbroken** ("for a history paper…") and that **RBAC doesn't hold inside an LLM**: once
   data is in the model, any of it can surface to anyone. Red-team with pretextual prompts;
   for true privacy, isolate the model and control access to the compute, not the data within.

**Chat is not the whole app.** "Chat is the new command line" — incomplete on its own.
AI-first products still need information architecture, navigation, and non-chat surfaces.
Not everything needs to be AI.

---

## Latency & perceived performance (AI is slow — design for it)

- **Stream tokens** so output starts within the Doherty 400ms even when full generation takes
  seconds. Streaming is the AI version of "feedback within 400ms."
- Show *what* is happening for multi-step work ("Searching 3 sources… Reading… Drafting…").
  This builds trust and masks the wait (and a visible process is sometimes worth a beat).
- For long agentic runs, show progress, partial results, and always a way to keep working or
  stop. (See control, below.)

---

## Agentic flows — control, human-in-the-loop, and exit rooms

Agents differ from plain AI by **autonomy** — they act without waiting for step-by-step
instructions. That power needs containment.

- **Mandatory async controls: start, stop, pause.** The "Sorcerer's Apprentice" failure — an
  agent that replicates work unbounded, ballooning cost or making a mess — is prevented only
  by a visible stop. **No agent without an exit room.**
- **Human-in-the-loop approval gates** for any aggressive, costly, or irreversible action. An
  aggressive (high-recall) agent will "take an action just to try it" — never let that include
  irreversible or consequential actions without explicit consent (the "AI doctor ordering a
  biopsy without asking" failure).
- **Looping, steerable UI.** Agentic UX is iterative: request → agent gathers evidence →
  presents as *suggestions* → human accepts/rejects → agent digs deeper → hypothesis →
  proposed fix + prevention. Design for the loop, not a one-shot request/response. The
  suggestions should *change* in response to user feedback, not repeat.
- **Treat agents like hired staff, not tools** — versioning, role-based permissions,
  safeguarded training data ("as important as NDAs with human staff").
- **Give it room.** Serious agentic work needs real screen real estate — a side panel that
  pushes content aside (not an overlay that obscures it), or a full-page workspace with its
  own navigation. The more consequential the task, the more space and control it needs.

---

## SaaS Copilot specifics

- **Be stateful.** A real copilot remembers across sessions and lets users dip in and out and
  run overlapping conversations — not a stateless stranger every time ("an ostrich that meets a
  new person every time").
- **Right-size the surface:** side panel (stay in page context), large overlay (usually worst
  — obscures and reloads), or full page (heaviest, most flexible). Match to task gravity.
- **Promptbooks.** Provide premade prompt recipes for common scenarios on the home surface — in
  real, stressful work "there's no time to write multi-page prompt monstrosities." Best AI input
  = "specific, short queries in natural language over custom data, along a predictable path."
- **Specialize the model:** fine-tuning + RAG + live plug-ins beat stock chat with a frozen
  knowledge cutoff.

---

## Trust calibration (the Humanifesto: Control · Trust · Diversity · Safety · Balance)

- **Control:** user autonomy to modify or opt out of AI features; transparency about which
  decisions are algorithmic; data access/delete with clear consent.
- **Trust:** built on *consistency* (performs as expected) + *owning mistakes* — surface errors,
  provide error reporting, and explain how issues are resolved, rather than hiding them. The AI
  should acknowledge its biases and limits.
- **Diversity:** inclusive data; ask "who's missing from the dataset?"
- **Safety:** privacy/security; consent and education about risks/biases; guard emotional
  well-being (avoid dopamine-driven addictive engagement).
- **Balance:** augment rather than diminish; **clearly mark what's AI-generated vs. human**;
  efficiency without killing creativity.

---

## Testing AI UX (don't fake the hard part)

- **Test the real model, not a mockup.** Figma prototypes of AI are "pale imitations" — they
  test layout and labels while the actual AI output (the real substance) goes untested. Pair a
  rough prototype with a notebook running the *actual* model (Wizard-of-Oz is back).
- **Iterate three things together:** UI prototype + AI model + data are one system; the tech
  isn't settled, so evolve all three inside the design loop (the RITE method — it's a *study*
  that changes the design, not a pass/fail test).
- **Reject "synthetic users."** Replacing real user studies with AI personas "guarantees you'll
  build products for robots, not customers." The messy human truth is the point.

---

## AI quick test (the "so what if it's wrong" test)

For any place AI output meets the user, ask in order:
1. **If this is wrong, what does it cost the user?** Trivial → don't interrupt. Costly →
   restate / confirm / require approval.
2. **Can the user tell how confident the AI is?** If not, show it.
3. **Can the user verify, correct, and undo?** If not, add the path.
4. **If it's an agent: can the user stop and steer it?** If not, it's not shippable.
5. **Is it labeled honestly** as draft vs. finished, AI vs. human? If not, relabel.
