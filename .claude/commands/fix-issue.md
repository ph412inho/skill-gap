---
description: Triage and fix a tracked issue end-to-end
argument-hint: <issue-id or description>
---

Fix the issue: $ARGUMENTS

Steps:
1. Restate the problem and which module it touches (M1–M5 / agent 1–8, see the POC plan §6, §10).
2. Locate the relevant code and read the surrounding context before changing anything.
3. Identify which killer assumption (plan §3) the area relates to, if any — don't weaken a test.
4. Make the minimal change. Match surrounding style (`rules/code-style.md`).
5. Add or update a test (`rules/testing.md`); for AI changes, note the eval metric affected.
6. Summarize what changed and why, and flag any `[ASSUMPTION]` you had to make.
