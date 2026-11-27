# Audit prompt: Red Team Path, Scope 2

You are auditing Scope 2 of Red Team Path, a study app built for Shad (Alberta, Canada). You did not build it. Read and test first; **change nothing** until Shad says OK.

- Repository: `C:\Users\SHADHUNTER\red-team-path` (this folder). GitHub: AlbertanCoder/red-team-path. Live: https://albertancoder.github.io/red-team-path/
- What changed: `git diff before-scope-2..scope-2-done` (and anything after the tag). Steps 1 to 6 existed before; Steps 7 to 14 are new.
- Saved course text the quizzes were checked against: `~/redteam/learn/sources` (one `<box>.txt` per box, lessons marked `@@@ <title> | <address>`). Question files: `~/redteam/learn/quizzes`. Build: `python tools/build_quizzes.py`.
- Tests: `tools/app_test.py`, `tools/walk_test.py`, `tools/sync_test.py`, `tools/linkcheck.py`, `node tools/proof_test.js`, `tools/jobs_test.py`. Shipping: `tools/ship.sh`.

## Who it is for, and what he asked for (his words and answers, 27 Nov 2026)

- No degree, self-taught, cannot read code yet; builds with AI tools. Wants to red team properly and understand the code he runs. Camp rotation: 14 days on (1-3 h a day), 7 off (2-8 h a day), about 15-20 h a week. Canadian citizen, no US work permit: everything paid must be open to someone in Canada.
- His 7 answers: (1) far enough for AI bug bounties and small contract red-team gigs; junior AI security jobs later. (2) Free first; a paid course only if it is a real, respected, self-paced, certified one, shown with its price first. (3) How models work plus Python that calls a model to test it at scale; no heavy maths, no model training. (4) New steps after Step 6; Steps 1-6 stay exactly as they are. (5) Done means real proof: a quiz from the source's own words, a public certificate/badge/profile link, public GitHub code he wrote, or a proof file the app can read; no plain honest-tick boxes for required steps. (6) Security basics bounty programs expect: web security, OWASP Top 10 for LLMs, Git and GitHub, a little Linux, report writing; not a full Security+ track. (7) freeCodeCamp's Python Certification as the main Python step; Harvard's CS50P after it as an optional box that never blocks.
- Keep him on track: the app is the coach, not the course (link the real course, never copy it); its own quiz before a box ticks (80%, a miss shows where to look, retry after a wait; Python questions include "what does this print?" and "spot the bug"); older topics come back on a 1 day / 1 week / 1 month ladder; an on-track card for his rotation that says plainly it cannot message him; "explain it back" at the end of each step, saying it cannot be graded.
- His picks from the gap check (`SCOPE-2-GAPS.md`): agent attacks with real impact as their own step; public proof = HackerOne and Bugcrowd profiles and a CTF/lab record; getting paid = platform screening practice, rules/safe harbor/NDAs, US pay and Canadian tax; one threat-model box; Step 5's PyRIT install fixed once proven broken (he later approved a second Step 5 line, `use_tls=False`).
- The approved plan is `SCOPE-2-PLAN.md`. Judge the app against his answers and the plan, not against anyone's summary.

## What to check (everything Scope 2 changed, and every claim around it)

1. **Old progress is safe.** Steps 1-6 and every old box id, quiz id and mark are unchanged (compare `buildSteps()` and the KNOWN registration at the two tags). Progress saved by the app at `before-scope-2` loads with every tick, on its own and on a linked device. Try to break it: an old-app device linking in, "clear all" on one device, a device offline.
2. **Every new box.** Its link opens the right official page; "free" or the price, "open to Canada", hours and claims are true today (open each page yourself; record page, date, what it says); its numbered steps work as written for a Windows beginner; its proof check works, and the box cannot be ticked without its proof (try: locked button, editing localStorage, a fake GitHub repository with the right file names but nonsense inside, a garak report from the test generator, a link of the wrong shape).
3. **Every quiz question and Library lesson** matches its source (spot-check widely, all code questions fully: run every snippet and confirm the right option is exactly what it prints or does). Look for questions that can be guessed, hints that give answers away, and right answers that are wrong.
4. **Coaching**: review questions, the on-track card, Explain it back and the practice answers on a phone-sized screen (390 px) and after linking two devices. Does the review ladder ever show a right answer after a miss? Does the nudge show at the right time? Does anything block Next that should not?
5. **Safety and honesty**: nothing tells him to test outside a program's scope; key handling (environment variables, `.gitignore`, the key scan) is right; tax and pay text quotes official pages and says it is not advice; no claim in the app, README, AUDIT.md, PROOF.md or SCOPE.md is untrue.
6. **Tests and release**: all tests pass local and live; the live `app.js` is the pushed one; `quizzes.js` is what `build_quizzes.py` makes from the question files.
7. **Gaps**: anything still missing for "earning from AI bug bounties and small contract gigs from Canada", most important first.

## How to report

- Write `AUDIT-SCOPE-2.md` in this folder: a 5-line summary for a phone first, then findings, most serious first. Each finding: what is wrong, where (file:line or box id), how you proved it (command and output, or page and date), and the smallest fix.
- Plain English, short sentences, no jargon without a one-line meaning. Shad cannot read code.
- Fix nothing until Shad says OK. Then: tag the commit first (`before-audit-fixes`), ship with `tools/ship.sh`, check the live site, one fix at a time.
- Usage: Shad stops all building at 75% weekly usage and nothing after 10 pm Alberta (UTC-6). If the audit would go past either, say so and stop at a clean point.
