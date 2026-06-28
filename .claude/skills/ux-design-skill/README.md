# ux-design skill

A Claude Code skill encoding award-winning, enterprise-grade UX judgment — weighted toward
AI/LLM and enterprise SaaS products. Synthesized (not summarized) from five books:

- **The Design of Everyday Things** — Don Norman (mental models, affordances, feedback, error-tolerant design)
- **Laws of UX**, 2nd ed. — Jon Yablonski (psychological laws, ethics/dark patterns)
- **The Mom Test** — Rob Fitzpatrick (user empathy, avoiding false validation)
- **UX for AI** — Greg Nudelman (AI/LLM patterns, trust, agentic control)
- **Usability & UX Design** — Benjamin & Michaela Kauer-Franz (ISO usability, evaluation, enterprise/internal tools)

## What's here

| File | Purpose |
|---|---|
| `SKILL.md` | Entry point: prime directive, modes, core principles, hard rules, ten-second tests |
| `principles.md` | The 10 core principles in depth (trigger · do · don't · test) |
| `negative-prompts.md` | Anti-pattern catalog — what to never do, and how to detect it |
| `patterns.md` | Pattern library — flow, perceived performance, states, delight, exit rooms |
| `ux-writing.md` | Voice, labels, errors, empty states, notifications, "inform but not too much" |
| `ai-ux.md` | AI/LLM patterns — uncertainty, trust, the 7 LLM patterns, agentic control |
| `enterprise.md` | Enterprise/internal SaaS — density, power users, configurability, vocabulary |
| `research-empathy.md` | Building an accurate user mental model — The Mom Test, good vs bad data |
| `checklists.md` | Ready-to-run audit checklists and tests |

## Installing it as a usable skill

This folder is a self-contained skill. To activate it in Claude Code:

- **Personal (all your projects):** copy the folder to `~/.claude/skills/ux-design/`
  (Windows: `C:\Users\<you>\.claude\skills\ux-design\`).
- **Project-only:** copy it to `<project>/.claude/skills/ux-design/`.

Claude reads the `description:` in `SKILL.md` to decide when to invoke it, then loads the
reference files on demand. No build step; it's just Markdown.

## Design intent

The skill is written to be **operational, not inspirational**: every principle has a trigger,
a do, a don't, and a test, so it can be applied mid-task or used to audit real screens —
acting like a senior product designer who is opinionated and tied to user benefit, not taste.
