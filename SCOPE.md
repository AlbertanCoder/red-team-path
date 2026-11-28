# SCOPE: Red Team Path

## Change request in force today (one day only)

- **Made by Shad:** Wed Nov 18 2026, 11:50 pm Alberta time (as stated by Shad).
- **Written into this file:** Thu Nov 19 2026, 07:3x am Alberta time, by Claude, from Shad's message at session start. No written copy from Nov 18 was found on this computer, so the Nov 18 time rests on Shad's word.
- **Takes effect:** Thu Nov 19 2026 only, and for this repo (red-team-path) only.
- **Paused today:** session cap (180 min), daily cap (240 min), scope hour budget, checklist size limit.
- **Reason (Shad's words):** this is the only thing I'm building. After it I'm switching from building to learning, and this app is what I learn with, so I want it finished properly in one day.
- **Still on today:** the weekly usage rule as normal, including the full stop at 75%. No work after 10:00 pm (wrap-up starts 9:45 pm). The 60-minute check-ins. Scope creep goes to IDEAS.md.
- **Ends:** all rules are back in full on Fri Nov 20 2026. They stay on today for every other project.

---

## Scope 1: Fix-up day

**Goal:** Make Red Team Path a clean, correct study tool: one simple tutor page per lab, videos and labs in the right order with one clear next step, less clutter on a phone, and a Jobs section that stays current.

### Done checklist (each one needs proof)

- [x] 1. Safety tag `before-fixup` pushed before any change. Proof: `git ls-remote --tags origin before-fixup` shows commit 018548c.
- [x] 2. Audit report given, and Shad's answers recorded in FIXUP-NOTES.md. Proof: commits 1281899 (audit) and a1d7d46 (answers).
- [x] 3. Four layout previews live in a `preview/` folder, one picked by Shad. Proof: four live links answered 200 (commit a1d7d46); Shad picked layout 4 at 08:05 Alberta, written in FIXUP-NOTES.md.
- [x] 4. Build plan approved by Shad before the app itself changes. Proof: plan committed in af921d8 while the app was still untouched; go-ahead given 08:10 Alberta and noted in FIXUP-NOTES.md.
- [x] 5. Every one of the 12 labs has one tutor page with exactly: what it is, objective, how to think, Hint 1/2/3 (one at a time), full answer (locked until 3 hints + "I tried"), what's next, and a verified/unverified label. Proof: `tools/app_test.py` on the live site opens all 12 (commits e533844, 3c702ff, 65ccbf8). 8 answers were run in the real labs; see PROOF.md.
- [x] 6. Videos and labs in the right order with one clear "do this next" from first video to last lab. Proof: the live test taps through all 49 boxes in the planned order (commit b51022c); `tools/walk_test.py` and `tools/linkcheck.py` passed on the live site (0 dead links of 86).
- [x] 7. Saved progress kept: ticks made in the old app still show in the new one. Proof: `tools/app_test.py` loads data saved by the old app (ticks, a note, hints opened in the old lab coach) and finds all of it in the new app, on the live site.
- [x] 8. Clutter removed in the layout Shad picked; preview folder deleted. Proof: counts in FIXUP-NOTES.md under P5 (commit 9717183); live `preview/4.html` answers 404 (commit bb6315c).
- [x] 9. Jobs section current, and updating weekly as Shad asked. Proof: first weekly scan ran on GitHub (run 44551308603, commit 06ca309, 10 new ads); daily checker dry run: open=19 closed=0 unknown=0.
- [x] 10. Final commit pushed, tagged `scope-1-done`, live site checked. Proof: the tag on GitHub and the last `tools/ship.sh` run.

### Closed

Scope 1 closed on Thu Nov 19 2026 at 09:28 Alberta, after 121 minutes, with every checklist item proven. Tag: `scope-1-done`. What works and what is unfinished is in README.md. `~/scope-hq/ACTIVE.md` is back to "Active scope: none". Anything further is a new scope with a new "I agree".

### Out of scope

- New learning material beyond the lab tutor pages (no new lessons, courses or videos).
- Accounts, log-ins, a phone app in a store, or any paid service.
- Anything that would reset saved progress.
- Any other project.
- Any new idea not on the approved plan: it goes in IDEAS.md.

### Hour budget

8 hours (the normal maximum). Paused on Thu Nov 19 2026 only, by the change request above. From Nov 20 the normal rules apply again: if today's minutes have already used the 8 hours, the scope closes at tonight's wrap-up with what works.

### Change requests

- 2026-11-18 11:50 pm Alberta (stated by Shad; written down 2026-11-19): one-day pause of session cap, daily cap, scope hour budget and checklist size limit, for this repo, on 2026-11-19 only. Reason and limits are at the top of this file.

---

## Scope 2: Curriculum to paid work (approved and closed 27 Nov 2026)

**Goal:** New steps after Step 6 that take Shad from the end of the path to AI bug bounties and small contract red-team gigs: Python properly (freeCodeCamp's Python Certification, CS50P optional), Python that talks to AI models, how models work, web security and the OWASP LLM list, attacking AI agents, his own tool and portfolio, and getting paid from Canada. The app stays the coach: real courses linked, real proof, review questions, an on-track check for his 14-on / 7-off rotation, and Explain it back.

Full plan: `SCOPE-2-PLAN.md`. Gap check and Shad's picks: `SCOPE-2-GAPS.md`. Research checks: `AUDIT.md`, "Scope 2 research checks".

### Where things stand (update as you go)

- **Part 1 DONE 27 Nov 2026** (a26ce47, 1d1160f, 2b8f18f, all live, app_test 324 checks local and live, sync_test and walk_test passed live): Step 7 (fc1-fc10, xb7) with 80 quiz questions; quizzes on any box; review ladder; on-track card and rotation; Explain it back; Step 5 PyRIT fix (install 0.9.0, plus use_tls=False).
- Moved from Part 1 to Part 2: the GitHub proof check and the link-shape check (first used by Step 8's boxes, so they are built and tested there).
- **Part 2 DONE 27 Nov 2026** (about 11:57 Alberta): Steps 8 (gt1, lx1, ap1-ap3, xb8) and 9 (md1-md7, xb9), 78 quiz questions (shell questions run in Git Bash), the GitHub check (gt1, ap1-ap3; marks pf + box id; username in state.gh, device only), Library lessons t30-t33 and 14 words. Commit: see git log "Scope 2, part 2".
- **Part 3 DONE 27 Nov 2026** (about 12:13 Alberta): Steps 10 (wb1-wb6, xb10) and 11 (ag1-ag5, xb11), 85 quiz questions, the link proof (wb6, pf mark, link kept in notes), GitHub checks for ag1 (threat-model.md), ag4 (garak report from a real model) and ag5 (PyRIT script and result), Library lessons t34-t36 and 11 words. garak 0.17.1 and PyRIT 1.2.1 run on this PC first (PROOF.md). Venvs: ~/redteam/pyrit-check (new = PyRIT 1.2.1, old = 0.9.0, garak).
- **Part 4 DONE 27 Nov 2026** (about 27 Nov 2026 about 12:54 Alberta Alberta, cf16ed5): Steps 12-14, 121 quiz questions, GitHub checks tl1-tl4, two-link proof (pd2), practice answers (pd4), lesson t37, 11 words, README rewritten. Build time for Scope 2: about 2 h from the go-ahead at 10:50 to the tag at 12:54 (budget 16 h).
- **Scope 2 CLOSED 27 Nov 2026**: all 12 checklist items proven. Next: read the auditor's AUDIT-SCOPE-2.md; fixes only after Shad's OK.
- Quiz sources: ~/redteam/learn/sources (fcc/ holds freeCodeCamp's lesson files; make_fcc_sources.py builds fc1.txt to fc18.txt; digest.py and findq.py help write questions). Question files: ~/redteam/learn/quizzes/<box>.json.

### Done checklist (each one needs proof)

- [x] 1. Safety tag `before-scope-2` pushed before any change. Proof: `git ls-remote --tags origin before-scope-2` shows 0c60528 (27 Nov 2026).
- [x] 2. Gap check done and Shad's 5 picks recorded. Proof: `SCOPE-2-GAPS.md`, "Shad's picks".
- [x] 3. Plan approved before index.html, app.js, style.css or quizzes.js change. Proof: Shad picked "I agree, all 4 parts" on 27 Nov 2026 at about 10:50 Alberta (plan, Python split and 16-hour budget), with the app still at 0c60528.
- [x] 4. Step 5 proven: Microsoft's Lab 1 notebook run with the newest PyRIT; if it fails, the install line names the version that runs, and that run is in PROOF.md. Proof: PROOF.md, "Step 5: which PyRIT runs Microsoft's notebooks" (1.2.1 stops at line 1; 0.9.0 runs Lab 1 to the end against the real lab, 27 Nov 2026); box a1 step 4 now names 0.9.0.
- [x] 5. All 58 new boxes live in the planned order; `tools/app_test.py` walks all 107 boxes on the live site and fails to tick each new box without its proof. Proof: cf16ed5, `tools/ship.sh` live test ALL PASSED (344 checks): the walk visits all 107 in order; course boxes stay locked before the quiz, GitHub boxes before the check (tested against a pretend GitHub: good, missing, key-in-file, test-generator report, thin threat model, profile without the link), link boxes before a right-shaped address. `tools/walk_test.py` live: 118 checks, 119 boxes in the Path list.
- [x] 6. Every new quiz built by `tools/build_quizzes.py` from saved source text, every quote found word for word, every code question run. Proof: `python tools/build_quizzes.py` exit 0, 428 questions (364 new on 51 boxes), no REFUSED line; it also refuses guess-by-length and hints that give the answer away.
- [x] 7. Review questions, the on-track card and Explain it back work at phone width and across two linked devices (`tools/sync_test.py`). Proof: app_test (390 x 844, no sideways scroll) and sync_test live ALL PASSED (14 checks: a rotation set on one device shows on the other).
- [x] 8. Progress saved before Scope 2 loads with every old tick, local and live (new test). Proof: app_test "progress saved before Scope 2 loads with every tick and mark unchanged" passed local and live; sync_test: a device on the before-scope-2 app links in and the new marks come back to the store in about 4 s.
- [x] 9. Library: 8 new lessons and about 25 new words, each with sources. Proof: lessons t30-t37 with sources and one question each; 36 new words (84 in all); app_test checks the Library lists them.
- [x] 10. AUDIT.md records every new source; README updated; `tools/linkcheck.py` finds 0 dead links. Proof: AUDIT.md "Scope 2 research checks" (Steps 7-14); README rewritten (cf16ed5); linkcheck: 232 links, 0 dead, 4 refuse scripts (Indeed, aitraining.jobs, and the two CRA pages, read in Chrome). Note: github.com answered 504 to scripts for about 40 minutes at midday, then 200 again.
- [x] 11. Final commit pushed, tagged `scope-2-done`, live site checked. Proof: tag scope-2-done (see `git ls-remote --tags origin scope-2-done`), live app.js matches the pushed file, all tests above passed live on 27 Nov 2026 about 12:54 Alberta.
- [x] 12. `AUDIT-SCOPE-2-PROMPT.md` written and a fresh audit session opened in a new window. Proof: commit 2111bb3; Shad picked Fable 5.2; the new PowerShell window started `claude --model claude-fable-5-2` on 27 Nov 2026 (PC clock 12:55). Its report will be AUDIT-SCOPE-2.md.

### Out of scope

- Any change to Steps 1 to 6 except the one proven Step 5 install line.
- Copying any course into the app; accounts, servers or paid services; any paid course Shad has not approved with its price.
- Anything that would reset saved progress. The Job Hunter project.
- Any new idea not on the approved plan: it goes in IDEAS.md.

### Hour budget

16 hours of build time over several days, in 4 parts (6, 3, 4, 3 hours), each shipped and checked before the next. Weekly usage full stop at 75%; nothing after 10 pm Alberta; check-ins every 60 minutes.

### Change requests

- 2026-11-27 about 11:37 Alberta: Shad approved a second Step 5 change (beyond the install line): box a1 gets one numbered step adding `use_tls=False` to the notebook's HTTPTarget line, because labs on his own PC use http. Tested: the Lab 1 notebook runs to the end with it. No id, tick or order changes.

---

## Scope 3: audit fixes (opened 27 Nov 2026)

**Goal:** Fix every error found by the full audit (`AUDIT-FULL.md`), one fix at a time, each proven, and play each official lesson video inside the app. Go-ahead: Shad's instruction of 27 Nov 2026 ("when it writes its report, then it fixes everything it found"), his six decisions and the in-app videos change, all recorded in section 0 of the audit prompt. New ideas are not errors: they go to `IDEAS.md`.

**Usage at the start (Shad's screenshot, 27 Nov 2026 2:40 pm):** 71% all models, 93% Fable only. Full stop at 75% all models; nothing after 10 pm Alberta.

### Where things stand (update as you go)

- Tag `before-audit-fixes` on bf3d93e before any change.
- **Paused 27 Nov 2026, 4:16 pm Alberta, at a clean point**: fixes 1, 2, 3, 4, 5, 6, 8 and 9 are live and proven (387 checks local and live). Resumed 4:25 pm at Shad's 73%: fixes 10 and 7 live (400 checks). Shad then lifted the 75% stop (change request below); fix 11 onward under way. Usage could not be read; by the lead's own estimate it was close to the 75% line, so work stopped to ask Shad for the number. Next in order: 11 onward. Fix 6 still waits on Q1, Q5 and Q6 for its last parts. The real garak and PyRIT runs for fix 17 are done (audit folder, `helpers/real-runs.md`); the boxes are not rewritten yet.
- `AUDIT-FULL-PROMPT.md` is held back from the repository on this PC (`.git/info/exclude`) until Shad says whether to publish it (question Q4 in `AUDIT-FULL.md`).

### Done checklist (each one needs proof: the commit, the test that fails without it, the live check)

- [x] 1. B1: an address ending `#sync=` asks before it links this device. Proof: d46ed3a; 5 new checks in `tools/app_test.py` (2 failed on the live site before the change); `tools/ship.sh` local and live ALL PASSED (349 checks), 27 Nov 2026.
- [x] 2. B2: "Load this code" asks first and says it replaces. Proof: c1648df; 8 new checks (4 failed on the live site before the change); `tools/ship.sh` local and live ALL PASSED (357 checks), 27 Nov 2026.
- [x] 3. B3: one rotation mark at a time. Proof: d38e5b3; 5 new checks, one a first link through a pretend store (4 failed on the live site before the change); `tools/ship.sh` local and live ALL PASSED (362 checks), 27 Nov 2026. Left as it is: review timing still restarts after a backup load or a first link after a clear.
- [x] 4. B4: marks the app does not know are kept; no "I'm done" on a quiz box when the quiz file did not load. Proof: 5675cdf; 6 new checks (4 failed on the live site before the change); `tools/ship.sh` local and live ALL PASSED (368 checks), 27 Nov 2026.
- [x] 5. A2: the lab-proof checker stops refusing honest wins; its messages say what to do; new test cases. Proof: bb92a4f; `tools/proof_test.js` 109 cases (23 new, 21 fail on the checker before the change); the audit's attack script: honest wins refused 26 to 12, cheats passing 37 to 31, none newly passing; `tools/ship.sh` local and live ALL PASSED, 27 Nov 2026. Left: a file typed by hand in the after-reload shape still passes; 9 rarer honest cases are still refused (listed in the fix log).
- [x] 6. A1, A3, D1, C6: lab text (the GPT-4o date, download the chat before stopping, auto-reload, lab 7 hint 2, lab 10, issue 33). Proof: 7dd1af7; 5 new checks, all failing on the live site before the change; `tools/ship.sh` local and live ALL PASSED (373 checks), 27 Nov 2026. Waiting on Shad: a "Moving on, not solved" button for required labs (Q5); a re-test of the answers on a newer model (Q1); rewording of the hints that give the move away (Q6).
- [x] 7. A5, A11, A12, C3, C9 (Steps 1 to 6 rows): facts only. Proof: ec1cb25; 8 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (400 checks), 27 Nov 2026. a1 Python 3.10 to 3.13; a2 what the Lab 1 notebook really does; a3 set-up lines and a cost warning; p1 "Share link"; b1 and b3 0DIN's two rules; b4 what Anthropic's form needs; g6 an ended prize contest; t29 the live Anthropic program. m0 was already right after fix 6. Waiting on Shad: a3 run to the end on his key (Q7); g6 kept or replaced (Q8).
- [x] 8. A8: HackerOne and Bugcrowd address patterns. Proof: b42c029; 6 new checks (failing on the live site before the change); `tools/ship.sh` local and live ALL PASSED, 27 Nov 2026.
- [x] 9. A9, A10: the key pattern; ap3's counting rule. Proof: 4363507; 8 new checks (5 failed on the live site before the change); `tools/ship.sh` local and live ALL PASSED (387 checks), 27 Nov 2026.
- [x] 10. A13, B6, C10: wording on screen. Proof: b199a51; 4 new checks and 1 changed, all 5 failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (392 checks), 27 Nov 2026. Course-box quizzes no longer say "video"; a missed review says it comes back in 24 hours; Settings names everything stored online; the Library gives 27 Nov for its later sources; the GitHub limit message says to switch to the phone's data.
- [x] 11. E2: a quiz retry asks everything again in a new order (decision 3). Proof: f4ab685; 3 new checks and 2 changed (on the app before the change 2 fail and the third stops the run: the old retry passed after 2 answers); `tools/ship.sh` local and live ALL PASSED (402 checks), 27 Nov 2026. Quizzes already passed stay passed.
- [ ] 12. C5, E3: wrong and double-answer questions, give-away hints, project quizzes, guessable options, tighter builder guards (decision 3). Part 1 done: 81a77f6; 21 questions in 14 files (wrong or double answers fc3 q7, ap3 q8, wb3 q8, pd5 q2 and q7, pd1 q2; give-away hints; no project solution lines in fc8, fc10, fc12, fc15); 7 new checks, all failing before; `tools/ship.sh` local and live ALL PASSED (409 checks). Part 2 (guessable options and tighter builder guards) runs after fixes 15 to 17, which rewrite wb5, ag2, ag4 and ag5 anyway. ag5 q1 and wb5's hints are fixed there. Video questions (ep5 Q7, ep10 Q8, "orchestrator") wait on Q6.
- [x] 13. A4: Git on the PC with GitHub Desktop (decision 5). Proof: 305961e; 2 new checks, both failing before; `tools/ship.sh` local and live ALL PASSED (411 checks), 27 Nov 2026. Button names from GitHub's own help pages.
- [x] 14. E1, A7: tighter GitHub checks, each with a nonsense repository that fails and an honest one that passes (decision 4). Proof: c90124e; 26 new checks (a nonsense repository that fails and an honest one that passes for each rule), 13 failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (432 checks), 27 Nov 2026. Checks already passed stay passed.
- [x] 15. C1: OWASP 2026 (decision 2). Proof: 97e8b61; 4 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (436 checks), 27 Nov 2026. New wb5 source from OWASP's 2026 pages (old source and questions kept in ~/redteam/learn/sources-archive/). A wb5 pass already earned stays.
- [x] 16. C2: PortSwigger's 8 labs (decision 2). Proof: 2f71503; 3 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (439 checks), 27 Nov 2026. An ag2 pass already earned stays.
- [x] 17. A6, A7: garak and PyRIT run for real on a free model; steps rewritten from what worked; `PROOF.md` (decision 1). Proof: ba4d791; 5 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (444 checks), 27 Nov 2026. `PROOF.md` records both real runs.
- [x] 18. C4, C9 (Steps 7 to 14 rows), D2: box text. Proof: 1e851b1; 13 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (457 checks), 27 Nov 2026.
- [x] 19. C7, C8: Library lessons and words. Proof: f0dd042; 5 new checks, all failing on the app before the change; `tools/ship.sh` local and live ALL PASSED (462 checks), 27 Nov 2026.
- [x] 20. H: videos inside the app for py1 to py8, md1 to md7, wb2, wb6, gt1 and c50; `tools/walk_test.py` plays each one on the live site. Proof: 49219e4; 6 new checks in `tools/app_test.py` (the first fails on the app before the change and the run then stops); `tools/ship.sh` local and live ALL PASSED (467 checks); `tools/walk_test.py` on the live site at phone size played all 68 lesson videos inside the app, each staying on through a redraw, ALL PASSED, 27 Nov 2026.
- [x] 21. D3: Jobs tools. Proof: 369264f; 17 new cases in `tools/jobs_test.py` (7 fail and the run then stops on the tools before the change); `tools/ship.sh` ALL PASSED; a dry run of the daily check on today's 28 ads found 27 open and 1 really gone (DataAnnotation, 410), 27 Nov 2026.
- [x] 22. G: ease-of-use fixes. Proof: 8dd8cb6; 7 new checks, 6 failing on the app before the change (reduce motion was already kept for the side panels); `tools/ship.sh` local and live ALL PASSED (474 checks), 27 Nov 2026.
- [x] 23. E5: tests that can fail for what the records claim. Proof: 302d28c; 7 new checks and 1 tightened; a copy of the app broken 7 ways failed 8 checks, each naming its break, a copy with only the review timing broken failed the one-month check, and a hand-edited `quizzes.js` is refused by the new build check in `tools/ship.sh`; local and live ALL PASSED (480 checks), 27 Nov 2026.
- [ ] 24. F: records made true.
- [ ] 25. Every test local and live; tag `audit-fixes-done`; fix log at the end of `AUDIT-FULL.md`.

### Out of scope

- Any change to the meaning or order of Steps 1 to 6 beyond proven errors of fact, without Shad's answer. Removing a box. Anything that could reset saved progress. Spending money or using his keys or accounts. Any other project.
- Any new idea: it goes in `IDEAS.md`.

### Change requests

- 27 Nov 2026, about 5:10 pm Alberta, Shad: "Fix them all until you run out." The 75% stop line is lifted; work goes on, one fix at a time, until usage runs out. Nothing after 10 pm Alberta still holds.
