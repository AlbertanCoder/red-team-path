# Red Team Path

An audited path into AI red teaming, as a small web app with tick boxes that save. Everything in it is free except one optional set of labs.

**Open it:** https://albertancoder.github.io/red-team-path/

## The path

Built around one name, Microsoft, so you can say where you studied. Two named extras cover what Microsoft does not offer.

1. **Microsoft's videos, each with its lab**: the 10 episodes of AI Red Teaming 101, and after each attack episode the lab Microsoft built for it (12 labs). The labs are optional: they run on your own computer with Docker and need a paid OpenAI key, about US$5 of usage.
2. **Microsoft Learn, AI security fundamentals**: 3 short modules with quizzes and badges.
3. **Gray Swan Arena** (not Microsoft): free scored practice on chatbots and on agents, which Microsoft has no practice for.
4. **Python, on Microsoft Learn**: 8 short modules with small projects.
5. **Automation**: Microsoft's own PyRIT notebooks, run against the labs.
6. **Proof and bounties** (not Microsoft): a Microsoft Learn transcript and your write-ups, then Mozilla 0DIN and an application to Anthropic's model safety bug bounty.

Everything except Microsoft's labs is free. Every card has numbered "How to do this" steps.

## What the app does

- **Now** shows one thing at a time: the next box, a button to open it, and **I'm done**. Then the next one appears. The 10 videos play right there in the app.
- **Path** lists every box, each with a link to its page, and marks where you are.
- **Tutor** has four parts. My notes: a writing box for every lab, practice set and write-up, saved on your device as you type, with Copy and Save as a file. The other three: Lessons: 29 short lessons, each with its sources and one question. They cover the attack techniques, how the guardrails themselves are built ("How the defenses work": the instruction hierarchy, filters and classifiers, spotlighting, defense in depth), attacking AI that takes actions ("Agent and tool attacks": the lethal trifecta, injection that becomes an action, excessive agency, testing an agent only with permission), and turning practice into income ("Getting paid": the three ways it pays, building proof, writing a finding, staying in scope, and where the real programs are). Lab coach: for each Microsoft lab, questions, three hints, and a last-resort answer that opens only after all three hints. Think it through: seven steps that start from the goal and work backwards.
- **Words** explains about 50 terms in plain English, with search and a "Test me" switch. Each lesson shows its own new words.
- **Jobs** lists real ads with real links, the pay each ad posted and what it asked for, plus ready-made searches. An automatic check opens every ad once a day: each ad shows when its link was last checked, and is hidden once the link dies.
- **Menu** holds linking your devices, settings (dark or light, streak, backup code), the reasons for each place, the rules and a write-up template.

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
- `labs/`: how to install Microsoft's labs on Windows (`SETUP.md`), the one fix their files need (`Dockerfile.fixed`), a settings template and two small start and stop scripts.
- `icons/`: the app icon.
- The path and the reasons live at the top of `app.js`.
- `AUDIT.md`: the audit record. Every claim, whether it was checked against its source, and what was corrected.

Last audited: 18 Nov 2026.
