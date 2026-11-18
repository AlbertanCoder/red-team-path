# Red Team Path

A free, audited path into AI red teaming, as a small web app with tick boxes that save.

**Open it:** https://albertancoder.github.io/red-team-path/

## The path

1. **Microsoft AI Red Teaming 101**: 10 short videos.
2. **One course day, then practice, for 21 days**: the SecurityElites course "AI Red Teaming From Zero", then Gray Swan Arena's training sets. Five write-ups along the way.
3. **Python**: the first five sections of freeCodeCamp's Python Certification.
4. **Bounties**: Mozilla 0DIN, then an application to Anthropic's model safety bug bounty.

Everything is free and runs in a web browser.

## What the app does

- **Now** shows one thing at a time: the next box, a button to open it, and **I'm done**. Then the next one appears.
- **Path** lists every box, each with a link to its page, and marks where you are.
- **Words** explains about 40 terms in plain English, with search and a "Test me" switch. Each lesson shows its own new words.
- **Jobs** lists real ads with real links, the pay each ad posted and what it asked for, plus ready-made searches. An automatic check opens every ad once a day: each ad shows when its link was last checked, and is hidden once the link dies.
- **Menu** holds linking your devices, settings (dark or light, streak, backup code), the reasons for each place, the rules, a write-up template and the audit: every claim, whether it was checked against its source, and what was corrected.

## Saving and linking devices

Ticks save by themselves in the browser. To see the same ticks on a phone and a computer, open **Menu > Link my devices** on one of them and tap **Get a code**. Type that short code into the same place in the app on the other device. That is the whole setup: no account, no password and no links to open. The code works once and runs out in 10 minutes.

The first time two devices are linked, every tick from both is kept. After that the newest change wins, and a device with no internet sends its ticks when it is back online.

Linking stores only which boxes are ticked, and on which days, under a private code that is never shown. It holds no name, no email and nothing else about you.

## Put it on an iPhone home screen

1. Open the link in Safari.
2. Tap Share, then **Add to Home Screen**.

The home-screen app and Safari keep separate ticks, so link the one you use.

## Files

- `index.html`, `style.css`, `app.js`: the whole app. No build step and no libraries.
- `jobs.js`: the job ads. `tools/check_jobs.py` re-checks every link and rewrites this file. `.github/workflows/check-jobs.yml` runs it once a day and saves the result, so pull before editing.
- `icons/`: the app icon.
- The path, the reasons and the audit all live at the top of `app.js`.

Last audited: 17 Nov 2026.
