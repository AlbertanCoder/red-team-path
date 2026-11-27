# Red Team Path

A study path into AI red teaming, as a small web app that opens on the one thing to do now. Everything in it is free except one optional set of labs.

**Open it:** https://albertancoder.github.io/red-team-path/

## The path

Built around one name, Microsoft, so you can say where you studied. Two named extras cover what Microsoft does not offer.

1. **Microsoft's videos, each with its lab**: Episodes 1 to 7 of AI Red Teaming 101, and after each attack episode the lab Microsoft built for it. The harder versions of the labs come after Episode 7. The labs run on your own computer with Docker and a paid OpenAI key, about US$5 of usage.
2. **Microsoft Learn, AI security fundamentals**: 3 short modules with quizzes and badges.
3. **Gray Swan Arena** (not Microsoft): free scored practice on chatbots and on agents, which Microsoft has no practice for.
4. **Python, on Microsoft Learn**: 8 short modules with small projects.
5. **Automation**: Episodes 8 to 10, each followed by the task it shows, using Microsoft's own PyRIT notebooks.
6. **Proof and bounties** (not Microsoft): a Microsoft Learn transcript, then Mozilla 0DIN and an application to Anthropic's model safety bug bounty.
7. **Python, part 1** (freeCodeCamp, added 27 Nov 2026): the first half of freeCodeCamp's free Python Certification, from basics to object-oriented code, with 3 of its 5 certificate projects. Steps 8 to 14 (Scope 2, see `SCOPE-2-PLAN.md`) are being added in parts.

60 boxes count toward the path. 9 more are optional and never block the next step: 5 write-ups, and the 4 labs whose goal is harmful on purpose (labs 3, 4, 9 and 10).

## How the app works

- **It opens on the main menu:** a Continue card for the step you are on, how far along you are, and four bars: Path, Library, Jobs, Settings.
- **Every screen has a Menu button (top left)** for those five places, and a **Contents button (top right)** for the whole path with its ticks. Labs you moved on from are listed under "Come back to these". On a screen 1000 px wide or more, both panels sit open beside the lesson.
- **A step** shows the video, the lab's tutor page, or a short card with numbered steps. **The bottom bar** says what is next and holds the button that finishes the step.
- **Steps 1 to 6 are unchanged.** From Step 7 each box links to the real course page and says how long it takes and whether it needs your PC.
- **A course box** (Step 7) is finished only after its quiz is passed: 8 questions written from freeCodeCamp's own lesson pages, with "what does this code print?" and "spot the bug" questions whose answers were checked by running the code. A miss links the lesson to look at. The last box of the step, **Explain it back**, needs two answers of at least 25 words each; the app cannot grade them and says so.
- **Review**: one question from a box you finished comes back 1 day, then 1 week, then 1 month after its quiz, up to 5 a day, on the main menu. A miss shows where to look, never the answer, and brings the topic back tomorrow. It never blocks the next step.
- **On track**: in Settings you set the first day of your 14 days on; the main menu then shows the week (on shift or off), a target (about 10 or 30 hours), the days you studied this week, when the current step should finish, and, after quiet days, the smallest next step. The app has no server and cannot message you; it only shows this when you open it.
- **A video** is finished only after its quiz is passed (80%, written from the video's own words). A miss shows what you picked and where to rewatch; the retry opens 2 minutes later; the right answers show once you pass.
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

- **Library**: 28 short technique lessons with sources and one question each, the 48 words in plain English with search, seven thinking steps for when you are stuck, and your notes.
- **Jobs**: real ads. A daily check hides an ad when it closes. A weekly scan reads the public job boards of about 20 AI companies for new ads with titles like "red team" and "jailbreak", and lists them marked as not yet read by a person.
- **Settings**: link your devices, dark or light, a backup code, and a button per lab to hide its hints again.

## Saving and linking devices

Everything saves by itself in the browser. To see the same progress on a phone and a computer, open **Settings** (main menu, or the Menu button) on one of them and tap **Get a code**. Type that short code into the same place on the other device. No account, no password. The code works once and runs out in 10 minutes.

The first time two devices are linked, everything from both is kept. After that the newest change wins, and a device with no internet sends its changes when it is back online.

Linking stores only which boxes are ticked, which hints are open, lab results, and on which days, under a private code that is never shown. No name, no email. Notes you type stay on the device you typed them on.

## Put it on an iPhone home screen

1. Open the link in Safari.
2. Tap Share, then **Add to Home Screen**.

The home-screen app and Safari keep separate progress, so link the one you use.

## What works, and what is unfinished (19 Nov 2026, Step 7 added 27 Nov 2026)

Works, each with a check that passed on the live site:
- Step 7 (27 Nov 2026): a course box cannot be ticked before its quiz; progress saved before Step 7 loads with every tick; review questions, the on-track card and Explain it back work at phone width (`tools/app_test.py`); a rotation set on one device shows on another, and a device still on the older app cannot make the new marks disappear from the store (`tools/sync_test.py`).
- The app opens on the current step; progress saved by the older version carries over (`tools/app_test.py`).
- All 12 lab tutor pages; 8 answers run in the real labs on 18 and 19 Nov 2026 (`tools/verify_labs.py`, `PROOF.md`). Lab 12, which had no known answer, was solved on 19 Nov: 9 of 9.
- The order of the path, with one Next at every point: the test taps through all 49 boxes from the first video to the finish.
- Phone and computer stay in step once linked (`tools/sync_test.py`, two browsers on the live site).
- The 10 videos open in the app and every Open button has an address (`tools/walk_test.py`); no dead links (`tools/linkcheck.py`).
- Jobs: daily link check and weekly scan for new ads, both running on GitHub.

Unfinished, or not proven:
- The app cannot see your freeCodeCamp progress; it checks you with its own quiz. Hours per box are estimates (freeCodeCamp labels the whole certificate 300 hours).
- Lab 10 has no known answer. Its harmful goal was never run; only its key step was tested.
- Labs 3 and 9 show Microsoft's published example, which was not run for this app.
- The 8 Gray Swan practice links load, but a script cannot prove each set is still offered.
- Tested in a phone-sized desktop browser, not on a physical iPhone or Android phone.
- Ads found by the weekly scan are not read by a person. Some ask for experience.
- Microsoft's PyRIT notebooks in step 5 have not been run by the author of this app.

## Files

- `index.html`, `style.css`, `app.js`: the whole app. No build step and no libraries. The path, the lab pages (`LAB_PAGES`) and the lessons are data at the top of `app.js`.
- `jobs.js`: the job ads. Two GitHub jobs rewrite it, so pull before editing: `.github/workflows/check-jobs.yml` (daily, `tools/check_jobs.py`) and `.github/workflows/find-jobs.yml` (weekly, `tools/find_jobs.py`, feeds listed in `tools/job_feeds.py`).
- `tools/app_test.py`, `tools/walk_test.py`, `tools/sync_test.py`, `tools/linkcheck.py`: the checks. `tools/ship.sh` runs the main one before and after every push. `tools/verify_labs.py` runs the lab answers through Microsoft's real labs on your own computer.
- `labs/`: how to install Microsoft's labs on Windows (`SETUP.md`), the one fix their files need, a settings template and start and stop scripts.
- `PROOF.md`: what was run on the real labs. `AUDIT.md`: every claim, whether it was checked against its source, and what was corrected.
- `SCOPE.md`, `FIXUP-NOTES.md`, `IDEAS.md`, `TIMELOG.md`: the record of the 19 Nov 2026 rebuild.

Last audited: 18 Nov 2026. Rebuilt and re-checked: 19 Nov 2026.
