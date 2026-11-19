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
- [ ] 5. Every one of the 12 labs has one tutor page with exactly: what it is, objective, how to think, Hint 1/2/3 (one at a time), full answer (locked until 3 hints + "I tried"), what's next, and a verified/unverified label. Proof: a check script passes on the live site.
- [ ] 6. Videos and labs in the right order with one clear "do this next" from first video to last lab. Proof: the walk-through check on the live site, link check script exits 0.
- [ ] 7. Saved progress kept: ticks made in the old app still show in the new one. Proof: a test that loads old saved data into the new app.
- [ ] 8. Clutter removed in the layout Shad picked; preview folder deleted. Proof: before/after counts at phone width; `preview/` gone from the live site.
- [ ] 9. Jobs section current (and updating weekly if Shad asks for it). Proof: the check run's output and the date on the live Jobs screen.
- [ ] 10. Final commit pushed, tagged `scope-1-done`, live site checked.

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
