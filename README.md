# Red Team Path

A study path into AI red teaming, from Microsoft's free videos to paid bug bounty and contract work, as a small web app that opens on the one thing to do now. Everything in it is free except one optional set of labs and a few cents of AI model use.

**Open it:** https://albertancoder.github.io/red-team-path/

## The path

Steps 1 to 6 are built around one name, Microsoft, so you can say where you studied. Steps 7 to 14 (added 27 Nov 2026) take you from there to AI bug bounties and small contract red-team gigs.

1. **Microsoft's videos, each with its lab**: Episodes 1 to 7 of AI Red Teaming 101, and after each attack episode the lab Microsoft built for it. The harder versions of the labs come after Episode 7. The labs run on your own computer with Docker and a paid OpenAI key, about US$5 of usage.
2. **Microsoft Learn, AI security fundamentals**: 3 short modules with quizzes and badges.
3. **Gray Swan Arena** (not Microsoft): free scored practice on chatbots and on agents, which Microsoft has no practice for.
4. **Python, on Microsoft Learn**: 8 short modules with small projects.
5. **Automation**: Episodes 8 to 10, each followed by the task it shows, using Microsoft's own PyRIT notebooks (with PyRIT 0.9.0: newer versions break them).
6. **Proof and bounties** (not Microsoft): a Microsoft Learn transcript, then Mozilla 0DIN and an application to Anthropic's model safety bug bounty.
7. **Python, part 1** (freeCodeCamp): the first half of freeCodeCamp's free Python Certification, from basics to object-oriented code, with 3 of its 5 certificate projects.
8. **Git, Linux, and Python that talks to an AI model**: GitHub's own starter exercise, OverTheWire's Bandit levels 0 to 10, then your own `red-team-tools` repository: a first call to Google's Gemini API (free tier, open in Canada), a list of test prompts with every reply logged, and a scorer.
9. **How AI models work**: seven short lessons from Microsoft's free Generative AI for Beginners and AI Agents for Beginners: tokens, embeddings and RAG, function calling, agents, MCP, and why prompt injection works.
10. **Web security basics**: MDN on HTTP; PortSwigger's free labs (server-side flaws, XSS, API testing); OWASP's Top 10 for LLM applications; Hacker101's CTF on your HackerOne account.
11. **Attacking AI agents**: a threat model, PortSwigger's AI and MCP labs, then two real red-team tools, NVIDIA's garak and Microsoft's current PyRIT.
12. **Your own red-team tool and portfolio**: `probe.py`, a report in the shape bounty programs pay for, three public write-ups, and a GitHub profile that points to them.
13. **Getting paid**: rules and safe harbor, public HackerOne and Bugcrowd profiles, US pay forms and Canadian tax, how contract platforms screen people (with practice answers), and what OpenAI, Google, Microsoft and Mozilla 0DIN pay for.
14. **Python, part 2 and the certificate** (freeCodeCamp): data structures, recursion, algorithms, graphs, dynamic programming, the last 2 projects and the exam. Harvard's CS50P is an optional extra.

107 boxes count toward the path. 12 more are optional and never block the next step: 5 write-ups, the 4 labs whose goal is harmful on purpose (labs 3, 4, 9 and 10), applying to contract platforms, a first real bounty report, and CS50P.

Time: about 460 hours from Step 2 (an estimate; freeCodeCamp labels its certificate 300 hours). The order puts the skills that pay before the second half of Python, so bounty and contract skills come about 2 months before the certificate.

## How the app works

- **It opens on the main menu:** a Continue card for the step you are on, how far along you are, an on-track card, review questions when some are due, and four bars: Path, Library, Jobs, Settings.
- **Every screen has a Menu button (top left)** for those five places, and a **Contents button (top right)** for the whole path with its ticks. Labs you moved on from are listed under "Come back to these". On a screen 1000 px wide or more, both panels sit open beside the lesson.
- **A step** shows the video, the lab's tutor page, or a card with numbered steps and a link to the real course. **The bottom bar** says what is next and holds the button that finishes the step. From Step 7 each box says how long it takes and whether it needs your PC or works on a shift night.
- **A video** is finished only after its quiz is passed (80%, written from the video's own words). A miss shows what you picked and where to rewatch; the retry opens 2 minutes later; the right answers show once you pass.
- **A course, reading or practice box** (Steps 7 to 14) is finished only after its quiz is passed: 5 or 8 questions written from the course's own pages, with "what does this code print?" and "spot the bug" questions whose answers were checked by running the code. Same rules as the video quizzes; a miss links the lesson to look at.
- **Proof on GitHub** (Steps 8, 11 and 12): GitHub's exercise, your `red-team-tools` boxes, your threat model, your garak report (it must come from a real model, not garak's test generator), your PyRIT attack, your tool, report, write-ups and profile page are finished only when the app, reading your public repository through GitHub, finds the files it asks for in the right shape. It recounts the leaks in your results itself, and wants your tool built over several days. Any file holding something shaped like an API key fails the check, with a note to make a new key. The app cannot tell who typed the code, and says so.
- **Proof by link** (Hacker101, your HackerOne and Bugcrowd profiles, the freeCodeCamp certificate, and the optional CS50 certificate and first report): the address is checked for its shape only; the app cannot open those sites, and says so.
- **Explain it back**: the last box of each new step needs two answers of at least 25 words each. The contract-screening box asks six practice questions (20 words each). The app cannot grade them and says so.
- **Review**: one question from a box you finished comes back 1 day, then 1 week, then 1 month after its quiz, up to 5 a day. A miss shows where to look, never the answer, and brings the topic back tomorrow. It never blocks the next step.
- **On track**: in Settings you set the first day of your 14 days on; the main menu then shows the week (on shift or off), a target (about 10 or 30 hours), the days you studied this week, when the current step should finish, and, after quiet days, the smallest next step. The app has no server and cannot message you; it only shows this when you open it.
- **A required lab (1, 2, 5, 6, 7, 8, 11, 12)** is finished only with proof: the chat file the lab's own download button saves, read by the app the way the lab's scorer, or Microsoft's written rule, decides a win. The harmful-goal labs (3, 4, 9, 10) stay optional with **I beat it** and **Moving on, not solved**. "Skip Microsoft's labs" on the set-up box marks the labs moved on, not solved.

### A lab's tutor page

Every one of the 12 labs has one page with the same six parts and nothing else:

1. What this lab is
2. The objective: what counts as beating it
3. How to think about it: the technique, without the answer
4. Three hints that open one at a time. Hint 1 names the kind of technique, hint 2 applies it to this lab, hint 3 is nearly the full move.
5. The full answer, with why it works. It unlocks only after all three hints are open and you have typed one line about what you tried. That line is saved as your note for the lab.
6. What's next

Each page is labelled **verified** or **unverified**. Verified means the lab facts were checked against Microsoft's own lab file and the answer was run in the real lab and won: labs 1, 2, 5, 6, 7, 8, 11 and 12. The numbers are in `PROOF.md`. Unverified: labs 3 and 9 show the example Microsoft's researchers published and were never run; lab 4 (a toxin goal) gives no message wording on purpose; lab 10 has no known answer.

### Library, Jobs, Settings

- **Library**: 36 short lessons with sources and one question each (8 added in Scope 2: tokens, RAG, agents, MCP, excessive agency and output handling, data leaks through an agent, web basics, what bounty programs pay for), 84 words in plain English with search, seven thinking steps for when you are stuck, and your notes.
- **Jobs**: real ads. A daily check hides an ad when it closes. A weekly scan reads the public job boards of about 20 AI companies for new ads with titles like "red team" and "jailbreak", and lists them marked as not yet read by a person.
- **Settings**: link your devices, your rotation, dark or light, a backup code, your GitHub username for the proof checks (this device only), and a button per lab to hide its hints again.

## Saving and linking devices

Everything saves by itself in the browser. To see the same progress on a phone and a computer, open **Settings** (main menu, or the Menu button) on one of them and tap **Get a code**. Type that short code into the same place on the other device. No account, no password. The code works once and runs out in 10 minutes.

The first time two devices are linked, everything from both is kept. After that the newest change wins, and a device with no internet sends its changes when it is back online.

Linking stores only numbers: which boxes are ticked, quiz passes, review rungs, your rotation, study days, which hints are open, lab results, and on which days, under a private code that is never shown. No name, no email. Notes, written answers, links and your GitHub username stay on the device you typed them on.

## Put it on an iPhone home screen

1. Open the link in Safari.
2. Tap Share, then **Add to Home Screen**.

The home-screen app and Safari keep separate progress, so link the one you use. After an update, close and reopen it; the icon never needs re-adding.

## What works, and what is unfinished (27 Nov 2026)

Works, each with a check that passed on the live site:
- Progress saved before Scope 2 loads with every tick and mark unchanged, and the old 49 boxes still count (`tools/app_test.py`).
- The order of the path, with one Next at every point: the test taps through all 107 boxes from the first video to the finish (`tools/app_test.py`); all 119 boxes are in the Path list and every Open button has an address (`tools/walk_test.py`).
- No course box ticks before its quiz; no GitHub box before its check (tested against a pretend GitHub the test serves: a good repository passes, a missing one fails, one with a key in a file fails, a garak report from the test generator fails, a thin threat model fails); no link box before an address of the right shape.
- 428 quiz questions (64 on the videos, 364 on the new boxes): every quote found word for word in the saved subtitles or course text, every Python and shell question run (`tools/build_quizzes.py`).
- Review questions, the on-track card, Explain it back and the practice answers work at phone width (`tools/app_test.py`).
- Phone and computer stay in step once linked, including the new marks; a device still on the older app cannot make the new marks disappear from the store (`tools/sync_test.py`).
- All 12 lab tutor pages; 8 answers run in the real labs on 18 and 19 Nov 2026 (`PROOF.md`). Step 5's Lab 1 notebook runs to the end with PyRIT 0.9.0 (27 Nov 2026). garak 0.17.1 and PyRIT 1.2.1 were run on Shad's PC before their boxes went live (`PROOF.md`).
- Jobs: daily link check and weekly scan for new ads, both running on GitHub.

Unfinished, or not proven:
- The app cannot see your freeCodeCamp, PortSwigger, Bandit or Hacker101 progress; it checks you with its own quizzes. Link checks are shape only. The GitHub check reads files, not who wrote them, and GitHub limits checks to about 60 an hour per network.
- garak and PyRIT were not run against a real model (no key on the PC that built this). Whether garak's litellm option reaches Gemini is untested.
- Hours per box are estimates. Program rules, prices and job ads change; they were read on 27 Nov 2026.
- Pay forms and tax: the boxes quote the IRS, CRA, HackerOne and Bugcrowd pages; they are not tax advice.
- Lab 10 has no known answer. Labs 3 and 9 show Microsoft's published example, which was not run for this app. Step 5's Lab 5 notebook only loaded (its attack makes many paid calls).
- The 8 Gray Swan practice links load, but a script cannot prove each set is still offered.
- Tested in a phone-sized desktop browser, not on a physical iPhone or Android phone.
- Ads found by the weekly scan are not read by a person. Some ask for experience.

## Files

- `index.html`, `style.css`, `app.js`: the whole app. No build step and no libraries. The path, the lab pages (`LAB_PAGES`), the lessons and the GitHub checks are in `app.js`.
- `quizzes.js`: every quiz, built by `tools/build_quizzes.py` from question files and the saved course text kept outside the repo (`~/redteam/learn/quizzes`, `~/redteam/learn/sources`).
- `jobs.js`: the job ads. Two GitHub jobs rewrite it, so pull before editing: `.github/workflows/check-jobs.yml` (daily, `tools/check_jobs.py`) and `.github/workflows/find-jobs.yml` (weekly, `tools/find_jobs.py`, feeds listed in `tools/job_feeds.py`).
- `tools/app_test.py`, `tools/walk_test.py`, `tools/sync_test.py`, `tools/linkcheck.py`: the checks. `tools/ship.sh` runs the main one before and after every push. `tools/verify_labs.py` runs the lab answers through Microsoft's real labs on your own computer.
- `labs/`: how to install Microsoft's labs on Windows (`SETUP.md`), the one fix their files need, a settings template and start and stop scripts.
- `PROOF.md`: what was run. `AUDIT.md`: every claim, whether it was checked against its source, and what was corrected.
- `SCOPE.md`, `SCOPE-2-PLAN.md`, `SCOPE-2-GAPS.md`, `FIXUP-NOTES.md`, `IDEAS.md`, `TIMELOG.md`: the record of the 19 Nov rebuild and the 27 Nov Scope 2.

Last audited: 18 Nov 2026. Rebuilt and re-checked: 19 Nov 2026. Scope 2 built and checked: 27 Nov 2026.
