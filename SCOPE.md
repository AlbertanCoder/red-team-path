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

## Scope 2: Curriculum to paid work (approved 27 Nov 2026)

**Goal:** New steps after Step 6 that take Shad from the end of the path to AI bug bounties and small contract red-team gigs: Python properly (freeCodeCamp's Python Certification, CS50P optional), Python that talks to AI models, how models work, web security and the OWASP LLM list, attacking AI agents, his own tool and portfolio, and getting paid from Canada. The app stays the coach: real courses linked, real proof, review questions, an on-track check for his 14-on / 7-off rotation, and Explain it back.

Full plan: `SCOPE-2-PLAN.md`. Gap check and Shad's picks: `SCOPE-2-GAPS.md`. Research checks: `AUDIT.md`, "Scope 2 research checks".

### Where things stand (update as you go)

- **Part 1 DONE 27 Nov 2026** (a26ce47, 1d1160f, 2b8f18f, all live, app_test 324 checks local and live, sync_test and walk_test passed live): Step 7 (fc1-fc10, xb7) with 80 quiz questions; quizzes on any box; review ladder; on-track card and rotation; Explain it back; Step 5 PyRIT fix (install 0.9.0, plus use_tls=False).
- Moved from Part 1 to Part 2: the GitHub proof check and the link-shape check (first used by Step 8's boxes, so they are built and tested there).
- **Part 2 DONE 27 Nov 2026** (about 11:57 Alberta): Steps 8 (gt1, lx1, ap1-ap3, xb8) and 9 (md1-md7, xb9), 78 quiz questions (shell questions run in Git Bash), the GitHub check (gt1, ap1-ap3; marks pf + box id; username in state.gh, device only), Library lessons t30-t33 and 14 words. Commit: see git log "Scope 2, part 2".
- **Part 3 DONE 27 Nov 2026** (about 12:13 Alberta): Steps 10 (wb1-wb6, xb10) and 11 (ag1-ag5, xb11), 85 quiz questions, the link proof (wb6, pf mark, link kept in notes), GitHub checks for ag1 (threat-model.md), ag4 (garak report from a real model) and ag5 (PyRIT script and result), Library lessons t34-t36 and 11 words. garak 0.17.1 and PyRIT 1.2.1 run on this PC first (PROOF.md). Venvs: ~/redteam/pyrit-check (new = PyRIT 1.2.1, old = 0.9.0, garak).
- **Part 4 DONE 27 Nov 2026** (about 27 Nov 2026 about 12:54 Alberta Alberta, cf16ed5): Steps 12-14, 121 quiz questions, GitHub checks tl1-tl4, two-link proof (pd2), practice answers (pd4), lesson t37, 11 words, README rewritten. Build time for Scope 2: about 2 h from the go-ahead at 10:50 to the tag at 12:54 (budget 16 h).
- **Next: item 12**: AUDIT-SCOPE-2-PROMPT.md, then a fresh audit session in a new window (Shad picks the model).
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
- [ ] 12. `AUDIT-SCOPE-2-PROMPT.md` written and a fresh audit session opened in a new window.

### Out of scope

- Any change to Steps 1 to 6 except the one proven Step 5 install line.
- Copying any course into the app; accounts, servers or paid services; any paid course Shad has not approved with its price.
- Anything that would reset saved progress. The Job Hunter project.
- Any new idea not on the approved plan: it goes in IDEAS.md.

### Hour budget

16 hours of build time over several days, in 4 parts (6, 3, 4, 3 hours), each shipped and checked before the next. Weekly usage full stop at 75%; nothing after 10 pm Alberta; check-ins every 60 minutes.

### Change requests

- 2026-11-27 about 11:37 Alberta: Shad approved a second Step 5 change (beyond the install line): box a1 gets one numbered step adding `use_tls=False` to the notebook's HTTPTarget line, because labs on his own PC use http. Tested: the Lab 1 notebook runs to the end with it. No id, tick or order changes.
