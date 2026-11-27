# Audit of Scope 2 (Steps 7 to 14)

Done 27 Nov 2026, Alberta, by a fresh session (Claude Fable 5.2) that did not build it. Nothing in the app was changed. This file is the only new file.

## In 5 lines (read this on your phone)

1. **Your old progress is safe.** Steps 1 to 6 are unchanged apart from the two Step 5 lines you approved. Every old tick, quiz pass and mark still loads. All tests pass on your PC and on the live site.
2. **Seven things will stop you or teach you something out of date.** The biggest: no box teaches you to put code from your PC onto GitHub, yet 9 boxes say "commit and push". The app also refuses a real HackerOne profile address.
3. **The proof is weaker than it reads.** Every GitHub check passed on files with the right names and nonsense inside. Any quiz can be passed in about 6 minutes by trying again. Many Step 10 to 14 questions can be guessed.
4. **Two sources moved since the build.** OWASP now has a 2026 list (the app teaches 2025). PortSwigger's AI topic has 8 labs, not 4; the 4 new ones are about attacking AI agents.
5. **The words are honest overall.** All 239 quiz quotes I re-fetched today are on the real pages. No right answer is wrong. Money and tax text quotes official pages and says it is not advice.

Nothing is fixed. Say "OK" to the fixes you want, one at a time.

---

## Findings, most serious first

Each one: what is wrong, where, how I proved it, the smallest fix. "Box" means one item on your path. Ids like `ap1` are the box names the app uses.

### A. Things that will stop you, or teach you something out of date

**A1. No box teaches you to get code from your PC onto GitHub.**
- What: 9 boxes end with "commit and push". GitHub's exercise (box gt1) is done entirely in the browser. Nothing tells you to install Git or GitHub Desktop, copy a repository to your PC, or push. Box ap1 step 3 just says "Put it on your PC".
- Where: `app.js` line 400 (box ap1), and every "Commit and push" step after it (ap2, ap3, ag1, ag4, ag5, tl1 to tl4).
- Proof: searched `app.js` and `labs/` for "git clone", "install Git", "GitHub Desktop", "git push": 0 hits. "Commit and push" appears 9 times.
- Smallest fix: one new step in ap1 (or one small box before it): install GitHub Desktop, clone `red-team-tools`, commit, push, with GitHub's own help page linked.

**A2. The app refuses a real HackerOne profile address.**
- What: when you open a HackerOne profile, the address bar reads `https://hackerone.com/<name>?type=user`. The app only accepts the address without `?type=user`. It then says "Copy the address from the page itself", which is exactly what you did. This blocks box wb6 (Step 10) and box pd2 (Step 13) until you guess to delete the ending.
- Where: `app.js` lines 476 and 564 (the address patterns).
- Proof: opened a public HackerOne profile in Chrome today: the address bar became `.../jobert?type=user`. In a test browser the app answered that shape with "refused (That does not look like https://hackerone.com/yourname...)".
- Smallest fix: let the pattern accept an optional `?type=user` ending.
- Also: the app accepts `https://www.hackerone.com/<name>`, which is a dead address (404), and it accepts the example itself, `https://hackerone.com/yourname`. The app does say it checks shape only.

**A3. Box ag4 (garak) refuses an honest report if its "hit log" sits beside it.**
- What: garak writes two files, a report and a hit log. Step 3 tells you to read the hit log. If you copy both into `scans/`, the app reads the hit log first (it comes first in the alphabet), finds no report in it and fails all three lines. Two reports in the folder can fail the same way.
- Where: `app.js` line 2776 (it takes the first `.jsonl` file in `scans/`).
- Proof: test browser, pretend GitHub with `scans/garak.1111.hitlog.jsonl` and a good `scans/garak.1111.report.jsonl`: "✗ scans/garak.1111.hitlog.jsonl does not look like a garak report".
- Smallest fix: look at every `.report.jsonl` file and pass if one passes.

**A4. Boxes ag4 and ag5 (garak and PyRIT) were never run the way the boxes tell you to, and their steps have holes.**
- What the plan promised: "Which model each tool can reach is confirmed by running it before the box goes live." That was not done. PROOF.md says both were run only against built-in pretend targets. The README says so too, so nothing is hidden, but the promise was not kept.
- Holes in ag4: step 2 gives only the options, not the whole command (`python -m garak ...` is missing). It never says to set your OpenAI key first, and garak's own page shows only the Mac/Linux way (`export`); PowerShell needs `$env:OPENAI_API_KEY="..."`. The option it uses, `--probes`, still works but garak marks it "DEPRECATED, use --spec".
- Holes in ag5: PyRIT's example is written for a notebook. Pasted into a plain `attack.py`, it stops with "'await' outside function". The "secret-word system instruction" is not in that example at all; it is on another PyRIT page (Attack Configuration). The box says "Python 3.11 or newer", but PyRIT 1.2.1 refuses Python 3.15 (its package says `<3.15,>=3.11`), and 3.15 is what python.org offers today. Your PC has 3.12, so you are fine unless you update.
- Free first: both boxes push you to a paid OpenAI key (cents). garak's own page shows a free way (a small model on your own PC: `--target_type huggingface --target_name gpt2`). Google documents an OpenAI-style address for Gemini, which PyRIT might use with your free key. Neither is tested.
- Where: `app.js` lines 499 to 518. Proof: PROOF.md lines 137 to 138; garak's code (`cli.py`, v0.17.1) and README, PyRIT's docs and PyPI page, all read today.
- Smallest fix: run each box's steps once, for real, on your PC (your OK needed: it uses your key and costs cents, or use the free local model), then write the steps from what actually worked.
- Small mismatch: the README says there was "no key on the PC that built this", while PROOF.md says the Step 5 test used the labs with an OpenAI key on the same PC.

**A5. The OWASP list in box wb5 is one edition old.**
- What: OWASP now has "2026 Top 10 Critical Security Risks for LLM Applications". The order and numbers changed (Excessive Agency is LLM03:2026; it was LLM06:2025) and "System Prompt Leakage" is no longer on it ("Hidden Context Exposure" is LLM08:2026). Box wb5, its 8 quiz questions and Library lesson t34 use the 2025 numbers. AUDIT.md says the 2025 list "is still the current one": that is not true today.
- Where: `app.js` line 466; `quizzes.js` (box wb5); AUDIT.md, "OWASP Top 10 for LLM Applications".
- Proof: opened genai.owasp.org/top-10-for-llm-applications-2026/ in Chrome today; the site menu lists "LLM Top 10 for 2026" above "LLM Top 10 for 2025".
- Smallest fix: point wb5 at the 2026 list and rewrite its 8 questions from it. Until then, say on the box that it teaches the 2025 edition. Job ads may still name either.

**A6. PortSwigger's "Web LLM attacks" has 8 labs, not 4.**
- What: box ag2 says "all 4 labs". PortSwigger's list of all labs shows 8 under Web LLM attacks. The 4 new ones are "Exploiting AI agents to perform destructive actions", "...to exfiltrate sensitive information", "...to trigger secondary vulnerabilities" and "Bypassing AI scanner defenses...". That is the exact subject of Step 11.
- Where: `app.js` line 493. Proof: portswigger.net/web-security/all-labs in Chrome today. (The MCP topic does have 6 labs, as box ag3 says.)
- Smallest fix: change the title to 8 labs, add the new page, raise the hours, add quiz questions from the new page.

**A7. freeCodeCamp's honesty pledge rules out AI-written answers, and the app does not say so.**
- What: to claim the certificate you accept: "I pledge that I did not use AI tools to generate my solution unless the lesson explicitly said it was OK to do so", and that 100% of the project code is yours. The exam allows no "books, notes, AI tools, or other people". The app warns about this for Harvard's CS50P but not for freeCodeCamp. You build with AI tools, so this matters for the 5 certificate projects.
- Where: `app.js` line 208 (the freeCodeCamp steps) and line 621 (box fc18).
- Proof: freecodecamp.org/academic-honesty, read today.
- Smallest fix: one sentence in the project steps and in fc18.

### B. Proof that is weaker than it reads

Your answer 5 was: done means real proof, no plain honest-tick boxes. These are better than a tick, but less than the app's wording suggests.

**B1. Every GitHub check passed on nonsense.**
- What: I made a pretend repository for each box with the right file names and junk inside. All passed.
- Proof (test browser, pretend GitHub, your real app code):
  - ap1: `hello_model.py` holding only the comment `# generate_content`. App: "✓ hello_model.py calls a model."
  - ap2: an empty `run_prompts.py`, 10 made-up lines. Passed.
  - ap3: an empty `score.py`. Passed.
  - ag1: six headings and the word "blah" 150 times. Passed.
  - ag4: a 3-line file typed by hand. App: "✓ It ran against a real model (openai)."
  - ag5: three comment lines. App: "✓ ...imports PyRIT and runs an attack."
  - tl1: `probe.py` holding only `# click`. App: "✓ probe.py reads its settings from the command line."
  - tl2: five words on five lines, nothing under them. Passed. tl3: the same file three times. Passed.
  - tl4: a profile that says "I have never made anything called red-team-tools". App: "✓ It links red-team-tools."
- One check does not do what it says: tl1 wants "5 or more commits on 3 or more different days: built over time, not pasted in one go". It counts every commit in the repository. By Step 12 your Step 8 and 11 work has already put more than that there, so it passes on the day you start `probe.py`.
- The app does say "It cannot tell who typed the code", and the README says the check "reads files, not who wrote them". Both true. The ✓ lines claim more than was checked.
- Where: `app.js` lines 2645 to 2855.
- Smallest fixes, each small: tl1 counts commits that touch `probe.py`; tl2 and tl3 want some words under each heading; ap1 and ag5 ignore comment lines; ag4 wants a real number of attempts (your test run made 256); soften the ✓ wording ("names a model call").

**B2. Any quiz can be passed in about 6 minutes without knowing anything.**
- What: after a missed round, the retry asks only the questions you missed, with the same 4 options. Each retry removes one wrong option. Three retries (2 minutes apart) pass every quiz. This is your existing video rule, but it is now the only proof on 35 boxes (all 17 freeCodeCamp course boxes, Bandit, the 7 Microsoft lessons, wb1 to wb5, ag2, ag3, pd1, pd3, pd5).
- Where: `app.js` lines 2558 to 2635.
- Proof: reading the code; in the test browser a round of 1 of 8 right offered "Answer the 7 I missed again".
- Smallest fix: a retry asks all the questions again, in a new order.

**B3. Many Step 10 to 14 questions can be guessed.**
- What: I read all 364 new questions. Steps 7 to 9 are good: wrong options are believable. From Step 10 on, many wrong options are jokes. Examples: "Cooking" (wb6), "Zoom and Teams" (ag4), "Photos of the server room" (ag1), "Did you use a fancy font?" (tl2), "Gift cards only" (pd5), "Bubble sort" (fc17), "Passwords" (fc16).
- The builder's own guard was dodged, not met: `build_quizzes.py` refuses a box where "always pick the longest option" passes. In the later boxes one long silly wrong option was added so the count stays just under. Example (fc17): "Writing code that rewrites itself while it runs, so the program can change its own behaviour later".
- Numbers (questions without code): the right answer is the longest option in 39% of Steps 7 to 9, 53% of Steps 10 and 11, 61% of Steps 12 and 13, 59% of Step 14. Chance is 25%.
- A few quotes are found in the source but do not back the answer: fc13 q6 and q8 (the quote is only a heading, "Adding a Base Case"), fc14 q3, fc16 q8, md3 q5 (the lesson never mentions prompt injection). The answers themselves are right.
- Smallest fix: rewrite the wrong options in the Step 10 to 14 question files (about 170 questions), then rebuild. Tighten the guard to "longest or second longest".

**B4. Box pd4's quiz is built on six job ads.**
- What: its questions quote ads from Alignerr, Claru, Vettedlance, Syntony and Clera. All six pages open today. You reach Step 13 around April 2027; ads close. A missed question will then send you to a dead page.
- Where: `quizzes.js` (box pd4). Smallest fix: build this quiz from the platforms' standing pages, or accept it and re-check before Step 13.

**B5. Two things no app like this can stop** (for the record, no fix asked): editing the saved data in the browser ticks any box (I did it: fc1 ticked). The locked button itself held: forcing it did nothing. "Explain it back" accepts 25 copies of the letter "a"; the app says it cannot grade.

### C. Box text that is only partly true (all read on the official pages today)

| Box | The app says | The page says |
|---|---|---|
| fc1 | Make your profile public so your certificate shows | freeCodeCamp also needs your name set public and your certification setting set public |
| fc18 | 50-question exam | Only in freeCodeCamp's Dec 2025 announcement; the exam's settings are not public. The one-try-a-week wait is real (168 hours) |
| Step 7 | Certificate is "300 hours" | True, but freeCodeCamp gives every certificate that same label. It is not a Python estimate |
| c50 | "Submitting needs a free edX account" | You also need a GitHub account ("log in with your GitHub account, and click Authorize CS50") |
| c50 | About 60 hours | Harvard's FAQ: "10-20 hours for each week's problem sets", 10 weeks. 60 looks low |
| c50 | (nothing about a deadline) | "The overall deadline for the course is currently ... 30 June 2027". Your plan reaches it in June 2027 |
| lx1 | "use the ssh command the page describes" | The page gives host, port and name but no command. It is `ssh bandit0@bandit.labs.overthewire.org -p 2220` |
| lx1 | "Windows has SSH built in" | True on your PC. Microsoft calls it an optional feature, so name the fallback (Settings, Optional features, OpenSSH Client) |
| ap1 | Store the key "the way Google's key page shows for Windows" | The Windows steps are on another Google page (aistudio.google.com/docs/api-key). The linked guide shows only the Mac/Linux line |
| md1 to md7 | "Skip its code samples: they need paid Azure" | Too strong: both courses also describe a free way that runs on your own PC (Foundry Local) |
| md7 | Read agents lesson 18 for how agents are secured | Lesson 18 is "Securing AI Agents with Cryptographic Receipts" (signed records of what an agent did), not defences against injection |
| md3, md5 | 3 hours and 2.5 hours | About 3,400 and 3,100 words of reading. Two to three times too high |
| wb4 | No level given; it follows two Apprentice (beginner) boxes | The API testing labs are mostly Practitioner level (harder): 1 Apprentice, 3 Practitioner, 1 Expert |
| wb6 | HackerOne's docs say 26 points | The 26-point line is on Hacker101's own page ("When reaching a total of 26 points in the CTF, you become eligible for invitations to private programs"), not HackerOne's help page |
| ag1 | "Microsoft's AI/ML threat modeling page" | No link is given. It is learn.microsoft.com/en-us/security/engineering/threat-modeling-aiml |
| ag5 quiz q1 | PyRIT lists Python "3.11 to 3.15" | That is the docs for the next version. The released 1.2.1 stops below 3.15 |

Checked and true (a sample): all 18 freeCodeCamp lesson addresses are the first lesson of the right module, no module is skipped or doubled, the 5 projects are right and in order. GitHub Models was retired on 30 Jul 2026 (GitHub's docs). GitHub's exercise is a template and a finished copy carries the words the app looks for (I checked a real finished copy). Bandit Level 0 is port 2220. OverTheWire allows write-ups but "do not publish any credentials". MCP topic: 6 labs. garak 0.17.1 and PyRIT 1.2.1 are the newest releases. Canada is on Google's list for the Gemini API. The CRA's $30,000 line and the T2125 line are on the CRA pages (the $30,000 table sits inside a fold-out).

Steps 12 and 13 (your tool, and getting paid). Nothing here came out false. Part-true:

| Box | The app says | The page says |
|---|---|---|
| pd5 | "All four are open to people in Canada (checked 27 Nov 2026)" | No program names Canada. Microsoft, Mozilla 0DIN and Google shut out only people on sanctions lists or in sanctioned places, so Canada is in by not being shut out. OpenAI's page has no country rule at all (it runs on Bugcrowd). True in effect, but "checked" overstates it for OpenAI |
| pd5, lesson t37 | OpenAI: a behaviour must repeat at least 50% of the time | That line is about one case: someone else's text hijacking a victim's agent. It is not written as a rule for every report |
| pd5 | "OpenAI, Google and Microsoft pay for security impact through agents" | Right for OpenAI and Google. Microsoft's Copilot bounty pays for security bugs in general, not agents in particular |
| tl2 | Report "in the shape HackerOne asks for": Title, Summary, Steps to reproduce, Impact, Suggested fix | HackerOne's page lists Title, Steps to Reproduce, Expected vs. Actual Behavior, Impact, Supporting Material. No "Summary"; a fix is optional |
| tl3 | Write up "Microsoft's labs, PortSwigger's labs, Bandit-style practice" | OverTheWire allows write-ups but no passwords; the box does not repeat that. PortSwigger welcomes video solutions; I found no rule on written ones. Microsoft's labs have no rule either way |
| pd2 | "Read how HackerOne reputation and Signal work" (one link) | Signal is on a second page. "Contract networks recruit from these scoreboards" rests on one company (Syntony) naming HackerOne; nothing names Bugcrowd |
| pd4 | Alignerr, Vettedlance, Claru and micro1 screen with tests and interviews | Vettedlance: true ("Interview About 20 minutes", "never charges candidates"). Claru's ad describes no test. micro1's AI interview is a free practice tool, not part of its job ad. Alignerr says "work from anywhere" but does not name Canada |
| pd3 | The $30,000 small supplier line | True. Not said: the CRA counts worldwide sales toward the $30,000, US clients included. A point for your tax preparer, not for the app to advise on |

Checked and true in Steps 12 and 13: every link opens the right page. Microsoft's awards "range from $100 up to $30,000 USD"; 0DIN's from $500 to $15,000. OpenAI: "jailbreaks are out of scope". Google's AI program: jailbreaks in your own session do not qualify, "Rogue Actions" and "Sensitive Data Exfiltration" do (read in Chrome). Bugcrowd wants the W-8BEN from non-US people; HackerOne wants a tax form, an identity check and a payment method. Bugcrowd profiles are at bugcrowd.com/h/name. No tax statement in the app is wrong.

### D. Records that are not quite true

- AUDIT.md, PyRIT line: ends "Not yet run", but four lines later says it was run. Stale.
- AUDIT.md: "the 2025 list ... is still the current one" (see A5).
- SCOPE.md and the plan: "confirmed by running it before the box goes live" (see A4). SCOPE.md's Part 4 line also has a garbled time ("about 27 Nov 2026 about 12:54 Alberta Alberta").
- SCOPE.md item 6: "it also refuses guess-by-length". True for the exact test it runs; see B3 for how the later boxes got under it.
- Everything else I checked in README, PROOF.md and SCOPE.md matched what I found: test counts (344, 118, 14), 428 questions, 232 links with 0 dead, the live files equal to the pushed ones.

### E. Small things

- Quiz wording on course boxes still talks about videos: "where in the video to look" and "Rewatch these moments" (`app.js` lines 2581 and 2622).
- Labels: the 5 certificate projects are marked "SHIFT WEEK OK", but your plan puts certificate projects on off weeks. Boxes ag1, tl2, tl3 and tl4 have no label at all.
- Keys: the key scan reads today's files only. If a key was pushed and then deleted, the check passes, and the key is still public in the history. The warning about making a new key shows only when a key is found. One line in ap1 would cover it.
- On-track nudge: it appears on the third quiet day, not after three full quiet days. Harmless, arguably better.
- fc4 q6: the "broken" loop prints `h i` before it stops with an error. The question says it "stops with an error", which is true but not the whole picture.
- The certificate-project quizzes (fc8, fc10) show small pieces of a working answer. Fine after the project; nothing stops you opening the quiz before it.
- Review: your 10 old video quizzes all come due at once, 5 a day. That is as planned.

---

## What I checked and found sound

1. **Old progress.** I compared every box of Steps 1 to 6 at the two tags by running both versions: 58 boxes before, the same 58 after, same order. One box differs (a1, the two approved Step 5 lines). All 180 old saved ids still exist; 343 new ids, none clashing with an old one. `app_test.py` (old progress loads) and `sync_test.py` (a device on the old app links in; new marks return to the store in 4 seconds) pass on the live site. "Clear all" on any device clears everything everywhere, as it always did. The site has no offline copy and refreshes within 10 minutes, so an old app cannot linger on a device.
2. **Tests and release.** `node --check`, `proof_test.js`, `jobs_test.py`, `app_test.py` local (344 checks) and live (344), `walk_test.py` live (118), `sync_test.py` live (14), `linkcheck.py` (232 links, 0 dead, 4 refuse scripts): all pass. The five live files equal the pushed ones. A fresh `build_quizzes.py` run gives a file identical to `quizzes.js`, 428 questions, nothing refused.
3. **Quiz answers.** All 99 code questions were re-run by the build and I read each one: every right answer is right. I re-fetched the pages behind the quizzes today: 202 of 203 quotes found by script, the last one (Clera's ad) seen in Chrome, plus 36 of 36 from a sample of 8 freeCodeCamp lesson groups. One hint gives its answer away (fc12 q6: "the order of the letters does not change the sum"); I found no other.
4. **Coaching at phone width (390 px).** Main menu with both cards, a code quiz, the practice answers, the GitHub and link boxes: no sideways scroll. The review ladder: a miss shows where to look and never the answer (5 tries, 3 misses, checked the page each time); a right answer says 7 days; it stops at 5 a day; it never blocks Next. The on-track card showed the right week, days and finish date for a set rotation, and says it cannot message you.
5. **Safety.** Every testing box points at a practice target or your own target. Box pd7 says only inside a program's scope and rules. Keys: environment variable, `.gitignore`, and the key scan caught a planted key in the builder's test. Tax text quotes the IRS, CRA, HackerOne and Bugcrowd and says it is not advice.

## What is still missing for "earning from AI bug bounties and small contract gigs from Canada"

Most important first. Leads only; none is built or promised.

1. **Git on your PC** (A1). Without it Step 8 stops at its third box.
2. **One real, working run of garak and PyRIT** (A4), with a free model if possible.
3. **The 4 new PortSwigger agent labs** (A6) and the **2026 OWASP list** (A5): the newest material on exactly what pays.
4. **A one-page resume.** Contract platforms ask for one. The path builds a GitHub profile and two bounty profiles but no resume.
5. **Records for tax time.** Box pd3 covers the forms. Nothing prompts you to keep each payout statement and its date. A tax preparer will ask for them.
6. **Your first real target is optional.** Boxes pd6 and pd7 (apply, send a first report) never block, which is right, but the path can be "finished" with no real application sent. A nudge on the last screen would help.

## How this audit was done, and its limits

- Read the full change to `app.js` (1,122 new lines), all 364 questions, the plan, README, AUDIT.md, PROOF.md and SCOPE.md. Ran every test. Wrote my own tests for the proof checks and the coaching (they run in a throwaway browser against a copy of the app; your real progress was never touched).
- Four helper sessions read the official pages for the new boxes. I re-checked every "false" they reported myself, in Chrome or from the saved page, before writing it here. Two of their "false" calls I confirmed (A5, A6); one I softened (Python version, in A4).
- Not done: a real phone; garak and PyRIT against a real model (needs your key and your OK); every hour estimate; the Google AI program page line by line.
- **Usage: I could not read your weekly usage.** Chrome is not allowed to open Claude's settings page. This audit used a fair amount (one main session and four helpers). Please check the number before approving fixes.
- My test scripts, their output and the saved pages are kept in `~/redteam/learn/audit/scope2-2026-11-27/`.

## If you say OK

Tag first (`before-audit-fixes`), then one fix at a time with `tools/ship.sh`, live site checked after each. Suggested order: A2 (one line), A3 (a few lines), A7 (one sentence), A1 (one step), the C table (text only), B2 (retry asks everything), B1 (tighter checks), then A5, A6 and A4, which need new reading, new questions and a real run.
