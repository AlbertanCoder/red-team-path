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
- **Jobs** lists real ads with real links, the pay each ad posted and what it asked for, plus ready-made searches. A daily check hides an ad when its link dies.
- **Menu** holds syncing, settings (dark or light, streak, backup code), the reasons for each place, the rules, a write-up template and the audit: every claim, whether it was checked against its source, and what was corrected.

## Saving and syncing

Ticks save by themselves in the browser. To see the same ticks on a phone and a computer, open **Menu > Sync my devices** and turn syncing on. You get a private link: open it once on each other device. There is no account and no password.

Syncing stores only which boxes are ticked, and on which days, under a random code. It holds no name, no email and nothing else about you. Keep the link to yourself: anyone who has it can see and change your ticks.

## Put it on an iPhone home screen

1. Open the link in Safari.
2. Tap Share, then **Add to Home Screen**.

The home-screen app and Safari keep separate ticks. To link the home-screen app, paste your sync link into **Menu > Sync my devices** inside it.

## Files

- `index.html`, `style.css`, `app.js`: the whole app. No build step and no libraries.
- `jobs.js`: the job ads. `tools/check_jobs.py` re-checks every link, and `.github/workflows/check-jobs.yml` runs it once a day and saves the result, so pull before editing.
- `icons/`: the app icon.
- The path, the reasons and the audit all live at the top of `app.js`.

Last audited: 17 Nov 2026.
