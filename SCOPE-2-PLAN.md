# Scope 2 plan: from the end of the path to paid AI red-team work

Written 27 Nov 2026 (Alberta) for Shad. **Nothing in the app changes until Shad says "I agree".** Gap check and your 5 picks: `SCOPE-2-GAPS.md`. Safety tag `before-scope-2` = commit 0c60528, pushed.

## In short

- 8 new steps after Step 6 (Steps 7 to 14), 58 new boxes that count and 3 optional ones. Steps 1 to 6 stay exactly as they are, apart from the one Step 5 install line you agreed to fix once it is proven broken.
- The app stays your coach: every box links to the real course, says what to do now, how long it takes, the numbered steps, and what proof ticks it. Nothing is copied into the app.
- Proof is real: a quiz written from the source's own words (with "what does this code print?" questions that were run), code in your public GitHub that the app reads by itself, or a certificate link. A link the app cannot open is labelled as such.
- New coaching: review questions on a 1 day / 1 week / 1 month ladder, an on-track card for your 14-on / 7-off rotation, and an "Explain it back" note at the end of each step.
- Time: about 460 hours from today (my estimate). At about 17 hours a week: skills for bounties and contract gigs by about late March 2027, ready to apply and hunt by mid-April, the Python certificate by about early June 2027.
- Build: 4 parts, each shipped and checked live before the next. About 16 hours of build time over several days.

## The order, and why

| Step | What | Hours (est.) | Why it sits here |
|---|---|---|---|
| 2-6 | Your remaining path, unchanged | about 28 | Microsoft Learn, Gray Swan, Microsoft's Python basics, PyRIT, 0DIN |
| 7 | Python, part 1 (freeCodeCamp: basics to object-oriented, 3 of the 5 certificate projects) | about 144 | Everything after this needs you to read and write Python |
| 8 | Git, Linux, and Python that talks to an AI model | about 20 | From here on your code lives on GitHub, where the app checks it |
| 9 | How AI models work (tokens, embeddings, RAG, agents, tool use, MCP, why prompt injection works) | about 15 | You attack agents in Step 11; first know what they are |
| 10 | Web security basics (HTTP, how sites and APIs get hacked, OWASP Top 10 for LLMs, Hacker101) | about 50 | Bounty programs pay for security impact, which is web security |
| 11 | Attacking AI agents (your pick 1) | about 27 | This is what OpenAI, Google and Microsoft pay for |
| 12 | Your own red-team tool and portfolio | about 27 | Proof you can show, built on Steps 8 and 11 |
| 13 | Getting paid (your picks 2 and 3) | about 11, then ongoing | Profiles, rules, screening, US pay and Canadian tax |
| 14 | Python, part 2 and the Python Certification (CS50P optional after) | about 138 | The certificate. Placed last so earning skills come about 2 months sooner |

**One choice inside this order (approve it with the plan):** freeCodeCamp's course is split. The first half (basics to object-oriented code) is Step 7; the second half (data structures, recursion, algorithms, graphs, dynamic programming) and the exam are Step 14. Those later topics matter least for red teaming. The cost: the certificate arrives about 2 months later than doing Python in one go. If you would rather keep it in one piece, Step 14 moves back to sit right after Step 7 and nothing else changes.

freeCodeCamp's own settings label the Python Certification **300 hours** (`certification-settings.ts` in its code, read 27 Nov 2026). The split of those hours between boxes is my estimate.

## Every new box

Every box below is required unless it says optional. "Shift week OK" means it works on your phone or in a browser after a shift; "PC" means it needs your computer. Ids are new and never reuse an old one.

What the app checks, by type:
- **Quiz**: 5 questions for boxes under 3 hours, 8 for longer ones, written from the source's own words, 80% to pass, a miss shows where to look on the source page, the retry opens after 2 minutes (your existing rules). Python boxes include "what does this code print?" and "spot the bug" questions; every snippet is run when the quizzes are built, and a question whose stated answer is not what Python prints is refused.
- **GitHub (automatic)**: the app reads your public repository through GitHub's public API and checks the files are there and have the right shape. It cannot tell who typed the code: the box says so.
- **Link shape**: the app checks the address looks right (for example `freecodecamp.org/certification/<you>/python-v9`). It cannot open the page for you (those sites block it): the box says so.
- **Explain it back**: two typed answers of at least 25 words each. The app cannot grade them: the box says so.

### Step 7: Python, part 1 (freeCodeCamp)

Link for every box: freecodecamp.org/learn/python-v9 (the module named in the box). All boxes: quiz with code questions. Shift week OK unless marked PC.

| Id | Box | Hours | Proof |
|---|---|---|---|
| fc1 | Python Basics 1: what Python is, variables, data types, strings, 3 workshops | 15 | Quiz |
| fc2 | Python Basics 2: numbers, booleans, conditionals, 2 workshops and the travel weather lab | 15 | Quiz |
| fc3 | Python Basics 3: functions and scope, the Caesar cipher, 2 labs, review and freeCodeCamp's quiz | 20 | Quiz |
| fc4 | Install Python, then Loops and Sequences (PC) | 12 | Quiz |
| fc5 | Dictionaries and Sets | 12 | Quiz |
| fc6 | Certificate project 1: User Configuration Manager | 6 | Quiz on your own project's requirements |
| fc7 | Error Handling, then Classes and Objects | 20 | Quiz |
| fc8 | Certificate project 2: Budget App | 8 | Quiz |
| fc9 | Object-Oriented Programming | 30 | Quiz |
| fc10 | Certificate project 3: Polygon Area Calculator | 6 | Quiz |
| xb7 | Explain it back: Step 7 | 0.25 | Explain it back |

How (fc1, the first box; the others follow the same shape with their own module):
1. Open freeCodeCamp's Python course and make a free account (email or GitHub sign-in). In Settings, make your profile public, so your certificate can be shown later.
2. Do the lessons in order: lecture, then workshop, then lab. Type every line yourself; do not paste.
3. When a workshop step fails its check, read the error message out loud before you change anything.
4. When the module is done, come back here and take the quiz. You are done when it passes.

Project boxes (fc6, fc8, fc10) add: "Write the project without looking at anyone else's answer. freeCodeCamp's own tests must pass before it counts toward the certificate."

### Step 8: Git, Linux, and Python that talks to an AI model

| Id | Box | Link | Hours | Proof |
|---|---|---|---|---|
| gt1 | GitHub's "Introduction to GitHub" exercise | github.com/skills/introduction-to-github | 1 | GitHub (automatic): your copy of the exercise exists in your account, made from GitHub's template. Plus quiz |
| lx1 | Linux basics: OverTheWire Bandit, levels 0 to 10 (PC) | overthewire.org/wargames/bandit | 6 | Quiz with "what does this command print?" questions (run when built). The app cannot see your Bandit levels |
| ap1 | Your first Python call to an AI model (PC) | aistudio.google.com (Gemini API, free tier, open in Canada) or your OpenAI key from the labs | 4 | GitHub (automatic): repo `red-team-tools` has `hello_model.py` that calls a model, `.gitignore` lists `.env`, and **no file holds a key** |
| ap2 | Send a list of test prompts and log every reply (PC) | same | 5 | GitHub (automatic): `prompts.json` with 10 or more prompts, `results.jsonl` with one line per prompt (prompt, reply, model, time) |
| ap3 | Score the replies (PC) | same | 4 | GitHub (automatic): `score.py` and `summary.json`; the app recounts `results.jsonl` and the totals must match |
| xb8 | Explain it back: Step 8 | | 0.25 | Explain it back |

What the Python boxes teach:
- **ap1**: installing a package with pip, keeping a secret key out of your code (a `.env` file Git ignores), calling a model and printing its reply.
- **ap2**: reading JSON from a file, a loop over test prompts, writing results as JSON lines, handling an error without crashing. The target is harmless and your own: a system prompt you write that guards a made-up secret word, like Microsoft's Lab 2.
- **ap3**: reading your own results back, a simple rule for "did the secret leak?" and "did it refuse?", and writing totals. This is the core of every red-team tool.

How (ap2):
1. In `red-team-tools`, make `prompts.json`: a list of 10 attack prompts from the labs (encodings, another language, a story).
2. Write `run_prompts.py`: read the list, send each prompt to the model with your secret-word system prompt, and add one line per reply to `results.jsonl`.
3. Run it, open `results.jsonl`, read every reply.
4. Commit both files and push. Then press **Check my GitHub** here.

Note on the Gemini free tier: Google's pricing page lists Flash models as "Free of charge" on the free tier (read 27 Nov 2026). Free-tier prompts may be used by Google; send nothing private. GitHub Models, which other guides suggest, was retired on 30 Jul 2026 (GitHub's own docs), so it is not used.

### Step 9: How AI models work

Microsoft's free courses on GitHub (MIT licence), read as text. All quiz. Shift week OK.

| Id | Box | Link | Hours |
|---|---|---|---|
| md1 | Introduction to Generative AI and LLMs (tokens) | generative-ai-for-beginners, lesson 01 | 1 |
| md2 | Prompt Engineering Fundamentals (tokens, the context window) | lesson 04 | 1.5 |
| md3 | Embeddings and RAG | lessons 08 and 15 | 3 |
| md4 | Function calling | lesson 11 | 1.5 |
| md5 | What an agent is, and tool use | ai-agents-for-beginners, lessons 01 and 04 | 2.5 |
| md6 | MCP and other agent protocols | ai-agents-for-beginners, lesson 11 | 1.5 |
| md7 | Why prompt injection works, and how agents are secured | generative-ai-for-beginners lesson 13; ai-agents-for-beginners lessons 06 and 18 | 3 |
| xb9 | Explain it back: Step 9 | | 0.25 |

How (every md box): read the lesson's text page on GitHub; skip its code samples (they need paid Azure); note one sentence per section; take the quiz.

### Step 10: Web security basics

| Id | Box | Link | Hours | Proof |
|---|---|---|---|---|
| wb1 | How the web talks: HTTP requests and replies | MDN, "Overview of HTTP" | 2 | Quiz |
| wb2 | PortSwigger path: Server-side vulnerabilities (Apprentice), with Burp Suite Community (free) (PC) | portswigger.net/web-security/learning-paths | 15 | Quiz. The app cannot see your solved labs |
| wb3 | PortSwigger: cross-site scripting (XSS), the Apprentice labs (PC) | portswigger.net/web-security/cross-site-scripting | 6 | Quiz |
| wb4 | PortSwigger path: API testing (PC) | portswigger.net/web-security/learning-paths/api-testing | 6 | Quiz |
| wb5 | OWASP Top 10 for LLM Applications (2025 list, all 10) | genai.owasp.org/llm-top-10 | 3 | Quiz |
| wb6 | Hacker101: the newcomer videos, then its CTF to 26 points (PC) | hacker101.com | 18 | Link shape (your HackerOne profile) plus quiz. HackerOne's docs: 26 points makes you eligible for private program invitations. The app cannot see your points |
| xb10 | Explain it back: Step 10 | | 0.25 | Explain it back |

How (wb2):
1. Make a free PortSwigger account and install Burp Suite Community Edition.
2. Open the learning path "Server-side vulnerabilities" and do each topic in order: read, then its lab.
3. Use Burp to watch every request a lab page sends before you change one.
4. A lab is done when PortSwigger marks it solved. When the path is done, take the quiz here.

### Step 11: Attacking AI agents (your pick 1)

| Id | Box | Link | Hours | Proof |
|---|---|---|---|---|
| ag1 | Threat model an AI agent before you test it (your pick 4) | OWASP Threat Modeling Cheat Sheet; Microsoft, "Threat Modeling AI/ML Systems" | 3 | GitHub (automatic): `threat-model.md` with six headings (what it is, what it can do, who might attack it, what could go wrong, what would hurt most, what I test first), 150 words or more |
| ag2 | PortSwigger: Web LLM attacks, all 4 labs (Apprentice to Expert) (PC) | portswigger.net/web-security/llm-attacks | 8 | Quiz |
| ag3 | PortSwigger: MCP server vulnerabilities, all 6 labs (PC) | portswigger.net/web-security/mcp | 8 | Quiz |
| ag4 | Scan a model with NVIDIA garak (PC) | github.com/NVIDIA/garak (version 0.17.1, Python 3.11 or newer) | 4 | GitHub (automatic): garak's own report file in `red-team-tools/scans/`, with the run's start, attempts and results |
| ag5 | One attack with today's PyRIT (PC) | github.com/microsoft/PyRIT (version 1.2.1) | 4 | GitHub (automatic): your script and its saved results |
| xb11 | Explain it back: Step 11 | | 0.25 | Explain it back |

What ag4 and ag5 teach: running real red-team tools against a model you are allowed to test (your free Gemini key or a small local model), reading their reports, and saving the evidence. Which model each tool can reach is confirmed by running it before the box goes live.

### Step 12: Your own red-team tool and portfolio

| Id | Box | Hours | Proof |
|---|---|---|---|
| tl1 | Turn ap2 and ap3 into one tool: `probe.py` reads a prompt set, attacks a model, scores, writes a report, with a README on how to run it (PC) | 15 | GitHub (automatic): `probe.py`, `README.md` with a "How to run" part, a sample report; 5 or more commits on 3 or more different days |
| tl2 | A report that gets paid: write one practice bug report for a PortSwigger LLM lab finding | 4 | GitHub (automatic): `reports/` file with Title, Summary, Steps to reproduce, Impact, Suggested fix |
| tl3 | Three public write-ups (only where the site's rules allow sharing) | 6 | GitHub (automatic): 3 files in `writeups/` with the app's write-up headings |
| tl4 | Your GitHub profile page points to all of it | 2 | GitHub (automatic): your profile README links `red-team-tools` |
| xb12 | Explain it back: Step 12 | 0.25 | Explain it back |

### Step 13: Getting paid (your picks 2 and 3)

| Id | Box | Hours | Proof |
|---|---|---|---|
| pd1 | Rules, safe harbor and NDAs: disclose.io; HackerOne's Gold Standard and AI Research safe harbor statements; Microsoft's Bounty Legal Safe Harbor; what an NDA stops you posting | 2 | Quiz |
| pd2 | Public HackerOne and Bugcrowd profiles (your pick 2) | 2 | Link shape (both profiles) plus quiz from their own docs |
| pd3 | US pay and Canadian tax: the W-8BEN (IRS), Bugcrowd's and HackerOne's payout steps, CRA form T2125 for business income, the $30,000 GST/HST line | 2 | Quiz. The box says plainly: not tax advice; ask a tax preparer before your first payout |
| pd4 | How contract platforms screen people, plus a practice run (Alignerr, micro1's AI interview, Vettedlance's 20-minute call, Claru's profile) | 2 | Quiz from their own pages, plus 6 practice answers typed in the app (saved as a note, not graded) |
| pd5 | What the big AI programs pay for: OpenAI Safety Bug Bounty, Google AI VRP, Microsoft Copilot bounty, Mozilla 0DIN (all open to Canada) | 3 | Quiz |
| pd6 | Optional: apply to 2 contract platforms from the Jobs list that are open to Canada | 2 | None (optional, never blocks) |
| pd7 | Optional: send your first real bounty report | | Link shape (the report's address), optional |
| xb13 | Explain it back: Step 13 | 0.25 | Explain it back |

Open to Canada, checked 27 Nov 2026: Mozilla 0DIN (excludes only US-sanctioned places), Microsoft's bounty (excludes residents of US-sanctioned countries), Google (rules read), OpenAI (runs on Bugcrowd, which takes a W-8BEN from non-US people). Handshake AI and 10a Labs ads are US only and are not used.

### Step 14: Python, part 2 and the certificate

| Id | Box | Hours | Proof |
|---|---|---|---|
| fc11 | Linear Data Structures | 15 | Quiz |
| fc12 | Certificate project 4: Hash Table | 8 | Quiz |
| fc13 | Recursion | 10 | Quiz |
| fc14 | Algorithms | 30 | Quiz |
| fc15 | Certificate project 5: Tower of Hanoi | 8 | Quiz |
| fc16 | Graphs and Trees | 30 | Quiz |
| fc17 | Dynamic Programming | 12 | Quiz |
| fc18 | Python Review, then the Python Certification Exam (PC) | 25 | Link shape: `freecodecamp.org/certification/<you>/python-v9`. freeCodeCamp's facts: 50 questions in its desktop exam app, after all 5 projects; every passing exam is reviewed by its staff |
| c50 | Optional: Harvard CS50P for a stronger certificate | about 60 (my estimate) | Link shape (your CS50 certificate). Free; certificate at 70% or more on every problem and the final project. **Its honesty rules forbid AI tools other than CS50's own (ChatGPT, Claude, Copilot and the like) for answers.** Never blocks the next step |
| xb14 | Explain it back: Step 14 | 0.25 | Explain it back |

### Count

New boxes that count: 58 (11 + 6 + 8 + 7 + 6 + 5 + 6 + 9). Path total: 49 + 58 = 107. New optional boxes: 3 (c50, pd6, pd7). New kinds: COURSE, READ, BUILD, EXPLAIN IT BACK, GETTING PAID (the old kinds are reused where they fit: PRACTICE for labs and CTFs, PROOF for profiles).

## Keep me on track

All of it saves in the same list as your ticks (box id -> time), so it links across devices exactly like ticks and never touches an old tick. Typed notes stay on the device they were typed on, as today; the app says so.

1. **The app's own questions.** Every required box except "Explain it back" has a quiz (rules above). Its pass is saved as `qz` + the box id (videos keep `qz1` to `qz10`). Question banks live in `~/redteam/learn/quizzes`, the saved source text in `~/redteam/learn/sources` (kept out of the public repo, like the subtitles). `tools/build_quizzes.py` grows to check every quote against the saved source and to run every code snippet.
2. **Older topics come back.** After a quiz passes, one review question from that box is due 1 day later, then 1 week after that, then 1 month after that. The main menu shows a "Review" card with up to 5 due questions a day; your 10 passed video quizzes join the ladder too. A right answer moves that topic up a rung (saved as `r1`, `r2`, `r3` + the box id). A miss shows where to look (never the answer) and puts the topic back on tomorrow's list at the same rung. Review never blocks Next.
3. **On-track check.** In Settings you pick the first day of your current 14 days on; the app works out on-shift or off week from then (saved as one of 21 rotation marks, `rt0` to `rt20`, so it links too). The main menu card shows: which week it is, this week's target (about 10 hours on shift, 30 hours off), on how many days you studied this week, and when the current step should finish at that pace. Study days come from ticks, quiz rounds, review answers, proof checks and an "I studied today" button (saved in 7 weekday marks, `ac0` to `ac6`; the button never ticks a box). After 3 quiet days on shift, or 2 on an off week, it says so plainly and offers the smallest next step: the current box's first numbered step, or today's review questions. It also says: "The app has no server and can't message you. It only shows this when you open it."
4. **Explain it back.** The last box of each new step asks: what I learned, and one thing I'd do with it. At least 25 words each, saved as that box's note. "The app can't grade this; it only checks you wrote enough."

## Library additions

New lessons in the existing format (idea, why, when, what stops it, one question, sources), ids t30 to t37: tokens and the context window; embeddings and RAG; agents and tool calling; MCP; excessive agency and insecure output handling; data leaks through an agent; web basics a bounty hunter needs (requests, IDOR, SSRF, XSS); what bounty programs actually pay for. New words (about 25): token, embedding, vector database, RAG, agent, function calling, MCP, excessive agency, data exfiltration, HTTP request, status code, API, JSON, repository, commit, terminal, XSS, IDOR, SSRF, path traversal, SQL injection, Burp Suite, scope, safe harbor, NDA, W-8BEN, threat model. Each new word shows on the box that introduces it, as today.

## Weekly plan for your rotation

A 3-week cycle: two on-shift weeks of about 10 hours (1 to 2 hours a night), one off week of about 30 hours (4 to 5 hours a day). Average about 17 hours a week, inside your 15 to 20.
- **On-shift weeks:** freeCodeCamp lectures and workshops in a browser, Step 9 reading, the OWASP list, Step 13 rules and tax pages, review questions. Boxes marked "Shift week OK".
- **Off weeks:** anything marked PC: installing Python, labs with Burp, your GitHub code, garak and PyRIT, certificate projects, the exam.

Rough calendar if you start Step 2 now (my estimates, about 460 hours in all):
- Steps 2 to 6: about 2 weeks, mid-December 2026.
- Step 7: about 8 to 9 weeks, mid-February 2027.
- Steps 8 to 11: about 6 to 7 weeks, late March 2027. **Bounty and contract skills ready.**
- Steps 12 and 13: about 2 weeks, mid-April 2027. Start applying and hunting.
- Step 14: about 8 weeks, early June 2027. Python Certification.

## Step 5 fix (your answer 5)

1. On your PC, in a fresh folder: install the newest PyRIT (1.2.1) and run Microsoft's Lab 1 notebook against your running labs (Docker, a few cents of OpenAI credit, the memory token from `~/ram-board` first).
2. If it fails at `pyrit.orchestrator`, find the newest PyRIT version the notebook runs with, and run it to the end with that version.
3. Change only Step 5's install line (box a1, step 4) to name that version. No id, tick or order changes.
4. Record the run in PROOF.md.

## Keeping your saved progress

- Only new ids are added; no old box id, quiz id, key or mark is renamed, reused or removed. The order of Steps 1 to 6 is untouched.
- A new test loads progress saved by today's app (every one of the 49 boxes, quiz passes, hints, lab results, the streak) into the new app and checks every tick is still there, on the local copy and on the live site.
- The linking test runs with two devices on the new app, and once with one device still on today's app.
- **Known risk, shown to you before it matters:** today's app throws away ids it does not know. A phone still running the old app could drop new ticks if it does a full re-send (first linking, or "clear all"). So after the first push: close and reopen the app on your phone and computer once before you tick a new box. The test above proves whether this risk is real; if it is, I stop and tell you first.
- `manifest.json` and the icons do not change, so the home-screen icon never needs re-adding: close and reopen it after each push.

## How it gets built

Four parts, one at a time. Each part: build, test, ship with `tools/ship.sh`, check the live site, tell you what to tap, then the next part.

1. **Part 1 (about 6 hours):** the engine (quizzes for any box, run-checked code questions, review ladder, on-track card and rotation setting, Explain it back, GitHub and link checks, new kinds), Step 7 with its 10 quizzes, the old-progress test, and the Step 5 fix.
2. **Part 2 (about 3 hours):** Steps 8 and 9, their quizzes, and their Library lessons and words.
3. **Part 3 (about 4 hours):** Steps 10 and 11.
4. **Part 4 (about 3 hours):** Steps 12 to 14, README, AUDIT.md, link check, tag `scope-2-done`, then the audit prompt and a fresh audit session.

Hour budget: 16 hours of build time over several days. That is more than the 8-hour normal of Scope 1; your "I agree" approves it, or tell me to cut it (for example, build Part 1 now and the rest later, since you reach Step 8 in about 10 weeks). Weekly usage: full stop at 75%; nothing after 10 pm Alberta; check-ins every 60 minutes.

Tests that change: `app_test.py` (49 -> 107 boxes, and the walk through every box, now also trying to tick each new box without its proof), `walk_test.py`, `linkcheck.py`, `sync_test.py` (review and rotation marks across two devices), a new old-progress test, `build_quizzes.py` (source quotes and code runs).

## Paid courses (your answer 2)

None recommended. The free path ends with two free certificates (freeCodeCamp, and CS50 if you do it). Python Institute's PCEP and PortSwigger's Burp Suite Certified Practitioner exam do not show a price on their pages; if you want a paid step later, I will show it with its price and why first.

## What the README will say afterwards

"The path" grows to 14 steps; "How the app works" adds the review card, the on-track card and Explain it back; "What works" lists each new check that passed on the live site; "Unfinished" names what no script can prove (PortSwigger, Hacker101 and Bandit progress, who wrote the code on GitHub, certificate pages the app cannot open, and that contract platforms and bounty programs change their rules).

## Go-ahead

Type **"I agree"** to approve this plan, its order (including the Python split) and the 16-hour budget. I will also need your weekly usage percentage when you next look: Chrome can no longer open the Claude usage page for me.
