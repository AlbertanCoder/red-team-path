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

49 boxes count toward the path. 9 more are optional and never block the next step: 5 write-ups, and the 4 labs whose goal is harmful on purpose (labs 3, 4, 9 and 10).

## How the app works

- **It opens on what you are doing.** A video plays right there. A lab shows its tutor page. Anything else shows a short card with numbered steps.
- **The bottom bar** says what is next and holds the buttons: **I'm done**, or for a lab **I beat it** and **Moving on, not solved**.
- **Path** (top right) pulls up the whole list. Tap any row to open it. Labs you moved on from are listed at the top under "Come back to these". Library, Jobs and Settings are at the bottom.

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

Everything saves by itself in the browser. To see the same progress on a phone and a computer, open **Path > Settings** on one of them and tap **Get a code**. Type that short code into the same place on the other device. No account, no password. The code works once and runs out in 10 minutes.

The first time two devices are linked, everything from both is kept. After that the newest change wins, and a device with no internet sends its changes when it is back online.

Linking stores only which boxes are ticked, which hints are open, lab results, and on which days, under a private code that is never shown. No name, no email. Notes you type stay on the device you typed them on.

## Put it on an iPhone home screen

1. Open the link in Safari.
2. Tap Share, then **Add to Home Screen**.

The home-screen app and Safari keep separate progress, so link the one you use.

## What works, and what is unfinished (19 Nov 2026)

Works, each with a check that passed on the live site:
- The app opens on the current step; progress saved by the older version carries over (`tools/app_test.py`).
- All 12 lab tutor pages; 8 answers run in the real labs on 18 and 19 Nov 2026 (`tools/verify_labs.py`, `PROOF.md`). Lab 12, which had no known answer, was solved on 19 Nov: 9 of 9.
- The order of the path, with one Next at every point: the test taps through all 49 boxes from the first video to the finish.
- Phone and computer stay in step once linked (`tools/sync_test.py`, two browsers on the live site).
- The 10 videos open in the app and every Open button has an address (`tools/walk_test.py`); no dead links (`tools/linkcheck.py`).
- Jobs: daily link check and weekly scan for new ads, both running on GitHub.

Unfinished, or not proven:
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
