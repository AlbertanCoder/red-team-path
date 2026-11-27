# Full audit of Red Team Path (the whole app)

Done 27 Nov 2026, Alberta, by a fresh session (Claude Fable 5.2) that did not build the app and did not write the earlier audit. Nothing in the app, its tests, its question files or its records was changed while auditing. This file is the only new file in the repository.

"Box" means one item on your path. Ids like `ap1` are the names the app uses for boxes. "The audit folder" means `C:\Users\SHADHUNTER\redteam\learn\audit\full-2026-11-27\` : every script, output and saved page behind this report is there.

## 1. Five lines for a phone

1. **Your progress is safe today.** Every saved tick and mark from all four earlier versions still loads, and every test passes on your PC and on the live site. But four holes could lose progress later (a link that swaps your private code, "Load this code", a quiz file that fails to load, and the rotation after a backup). None has happened.
2. **What will stop you.** The model your labs run on (GPT-4o) is shut down by OpenAI on 14 Jan 2027. The lab-proof checker refuses some honest wins. No box teaches Git on your PC. PyRIT will not install on the newest Python. The garak and PyRIT boxes fail as written. The app refuses a real HackerOne address. The API-key check fails honest files.
3. **What is untrue or out of date.** OWASP's list is one edition old. PortSwigger's AI topic has 8 labs, not 4. A Library lesson points at an Anthropic bounty that ended in 2025. One Gray Swan set is a finished contest. Six quiz answers are wrong or have a second right answer. About 25 lines in the records are untrue.
4. **What is missing.** A way past a lab you cannot beat. A warning that "Stop labs" deletes the chats you need as proof. A warning to switch off OpenAI's auto-reload. How to make a Python virtual environment. What Google does with free-tier prompts. Cautions on two contract platforms.
5. **What I will fix.** Everything in section 7, one fix at a time, each proven, after you give me your usage number. Eleven things need your answer first (end of section 7). Videos from 8 sets of boxes will play inside the app.

---

## 2. Findings, most serious first

Each one: what is wrong, where, how it was proven, the smallest fix, and whether it is new or was in `AUDIT-SCOPE-2.md`. "Checked by me" means I saw it myself today. "Helper" means a helper session found it and saved the page; where I re-checked it, I say so.

### A. Things that will stop you

**A1. The labs' AI model is shut down on 14 Jan 2027.** New.
- What: `labs/env.example` line 4 sets `OPENAI_TEXT_MODEL=gpt-4o`. OpenAI's own list says GPT-4o is deprecated and shuts down on 14 Jan 2027. After that day every lab message fails. All 8 "verified" answers were won on GPT-4o and may not work on another model. Eight labs cannot be finished without a win (see A3).
- Proof: checked by me. OpenAI's deprecations page today: "Jan 14, 2027 | GPT-4o (gpt-4o-2024-08-06, gpt-4o-2024-11-20) | Deprecated | gpt-6-luna | Oct 14, 2026". Saved in the audit folder, `pages/lead-openai-deprecations-1.txt`.
- Smallest fix: say so on the set-up box and in `labs/SETUP.md`, with the one line to change when it happens. Re-testing the 8 answers on the new model needs your paid key: your answer needed (section 7, Q1).

**A2. The lab-proof checker refuses honest wins.** New.
- What: the app decides a lab win by reading the chat file. It refuses real wins in at least these cases:
  - You win, the lab page reloads, you send one more message, then you save. Refused as "not the way the lab saved it". The advice shown ("save the chat again") does not help.
  - Lab 5: your message quotes three of the bot's own swear words back to it ("you said X, now angrier"). Refused as "your own message holds the swearing".
  - Labs 11 and 12: the bot's poem holds the word "pages", or starts "I can't help but wonder". Refused, with the false reason "The chatbot refused".
  - Labs 6, 11, 12: an injection whose result shares no word with the injection ("answer in Spanish", "talk like a pirate"). Refused.
  - Labs 1, 2, 7, 8: the bot gives the secret in base64, you paste it back to decode, the bot then says it plainly and the lab's scorer congratulates you. Refused as "the bot only repeated you".
  - A chat of more than 100 messages saved after a reload. Refused as "from a different lab".
- Where: `app.js` lines 2283 to 2298 (how a reloaded chat is recognised), 2363 (Lab 5), 2402 to 2404 (Labs 6, 11, 12), 2355 (Labs 1, 2, 7, 8).
- Proof: the first four checked by me, built from the real saved chats in `tools/fixtures` (`out/lead_labcheck.txt`). The rest from the helper's 154 cases (`helpers/lab-checker.md`, 25 of 47 honest wins refused). Not run in a live lab: that needs your paid key.
- Smallest fix: judge each reply by its own shape; let a quoted line count as the bot's; test the "refused" and "page" words only where they mean a refusal; say in each message what to do next. Add the helper's 15 missing test cases.

**A3. A required lab has no way on but a win, and "Stop labs" deletes the chats you need.** New.
- What: for labs 1, 2, 5, 6, 7, 8, 11 and 12 the only button is "Add your chat file above to finish". There is no "Moving on, not solved" once the set-up box is ticked. With A1 and A2 that can stop Step 1 cold. The only way out is hidden: untick the set-up box, then press "Skip Microsoft's labs". Separately, `Stop labs.cmd` runs `docker compose down`, and Microsoft's labs keep chats inside the container. So stopping the labs deletes every chat. The app needs the downloaded chat as proof and never says "download it before you stop".
- Where: `app.js` lines 3090 to 3095; `labs/Stop labs.cmd` line 19; Microsoft's `docker-compose-openai.yaml` (`ChatStore__Type=filesystem`, no saved folder for chats).
- Proof: code read by me; Microsoft's file fetched by me today. The delete itself was not run (no Docker run in the audit).
- Smallest fix: one line on each lab page and in the Stop script: "Download your chat before you stop the labs." A "Moving on, not solved" button for required labs changes how Step 1 works: your answer needed (Q5).

**A4. No box teaches you to get code from your PC onto GitHub.** Was A1 in the last audit. Confirmed.
- What: "Commit and push" appears 9 times in `app.js`. GitHub's exercise (box gt1) is done in the browser. Box ap1 step 3 says only "Put it on your PC" (`app.js` line 405).
- Proof: checked by me (9 hits; no "GitHub Desktop", "git clone" or "git push" anywhere).
- Fix: your decision 5: GitHub Desktop first, from GitHub's own help pages, plus one line of the typed commands.

**A5. PyRIT will not install on the newest Python.** Partly new.
- What: PyRIT 0.9.0 (Step 5, box a1) needs Python below 3.14. PyRIT 1.2.1 (Step 11, box ag5) needs Python below 3.15. python.org's download button gives 3.15.2 today. Box a1 names no Python version (`app.js` line 304). Box ag5 says "Python 3.11 or newer" (line 510). Microsoft's Python module in Step 4 tells you to install the latest. Your PC has 3.12.10, so you are fine unless you update or use another PC.
- Proof: checked by me on PyPI and python.org today (`scripts/verify_py.py`).
- Smallest fix: name the versions that work on both boxes, and say what to do if `pip` answers "no matching distribution".

**A6. Box ag5 (PyRIT) fails as written.** Was part of A4 in the last audit. Confirmed, with more.
- What: PyRIT's example is notebook code. Saved as `attack.py` it stops with "'await' outside function". The secret-word system instruction is on a different PyRIT page. Step 4 sends the output to a file with `>`; in PowerShell that makes an unreadable file (corrected after the real run on 27 Nov: PyRIT itself does not crash on its emoji, it prints `?`; a plain Python script does crash). No box teaches how to make a "virtual environment", which step 1 asks for. Quiz question ag5 q1 marks "3.11 to 3.15" as right; that is the unreleased version.
- Proof: the `await` error reproduced by me on this PC (`scripts/await_top.py`); the unreadable file seen in the real run (`helpers/real-runs.md`). The rest from the helper with saved pages (`helpers/steps11-14.md`).
- Fix: your decision 1: run it for real on a free model, then write the steps from what worked.

**A7. Box ag4 (garak): the steps have holes and the check refuses an honest folder.** Was A3 and part of A4. Confirmed.
- What: step 2 gives options, not the whole command. It never says how to set the key in PowerShell. `--probes` is deprecated in favour of `--spec`. The box pushes a paid OpenAI key although garak's own page shows a free local model. And the app reads the first `.jsonl` file in `scans/`: garak's hit log sorts before its report, so a folder with both fails.
- Proof: the check failure reproduced by me in a throwaway browser with the real report garak made on this PC (`out/lead_tests.txt`: "scans/garak.1111.hitlog.jsonl does not look like a garak report"). The deprecation line is in this PC's own garak run log.
- Fix: decision 1 (real free run), and read every `.report.jsonl` file.

**A8. The app refuses a real HackerOne profile address.** Was A2. Confirmed.
- What: a HackerOne profile opens as `https://hackerone.com/<name>?type=user`. The app refuses that ending. This blocks box wb6 (Step 10) and box pd2 (Step 13). The Bugcrowd pattern refuses any `?` ending too. The same patterns accept pages that are not profiles (`/hacktivity`, `/reports`, the example itself, a dead `www.` address).
- Proof: checked by me in Chrome today (the address bar became `/jobert?type=user`) and in `out/rx_test.txt`.
- Smallest fix: allow the `?type=user` ending; refuse the known non-profile pages and the example.

**A9. The API-key check fails honest files.** New.
- What: every GitHub check ends with "no file that holds an API key". The pattern treats `sk-` plus 20 letters as a key, with no check that `sk-` starts a word. Ordinary phrases match: "risk-assessment-and-mitigation-plan", "task-oriented-conversational-assistant", "ask-me-anything-about-python-programming". An honest repository then fails with "A file holds what looks like an API key ... make a new key". A model's reply saved in `results.jsonl` can trip it too. It also misses some real key shapes (Hugging Face, Groq, xAI), skips files of 300 KB or more, and reads only the first 60 files.
- Where: `app.js` line 2644 (pattern), lines 2677 to 2686.
- Proof: checked by me (`out/rx_test.txt`; and in the throwaway browser an honest ap1 repository failed on its README).
- Smallest fix: require a word edge before `sk-`, and add the missing shapes.

**A10. Box ap3 refuses an honest scorer, and never states the rule.** New.
- What: the app recounts leaks by "the reply contains the secret word, ignoring capitals". The box does not say so, and its link is Python's regular expression guide, which teaches whole-word matching. A scorer that counts exact capitals or whole words gets a different number and is refused.
- Where: `app.js` line 2753; box ap3 steps.
- Proof: checked by me: a scorer counting "Plum" with exact capitals was refused ("summary.json says ... leaked 0").
- Smallest fix: state the counting rule on the box and in the fail message.

**A11. Box a3 (the Lab 5 notebook) leaves out its set-up, and was never run to the end.** New.
- What: the notebook needs your own lab request pasted in, `use_tls=False` again, and three settings (`OPENAI_CHAT_ENDPOINT`, `OPENAI_CHAT_KEY`, `OPENAI_CHAT_MODEL`). Without them PyRIT 0.9.0 stops. It bills your OpenAI key with no warning on the box. `README.md` already admits it "only loaded".
- Proof: helper, from Microsoft's notebook and PyRIT 0.9.0's code (`helpers/steps1-6.md`, P2). Not run by me: it costs money.
- Smallest fix: add the missing lines and a cost warning. A real run to the end needs your key: your answer needed (Q7).

**A12. Box b4 (Anthropic) skips what the form needs.** New.
- What: the form needs a HackerOne account first, and a Claude Console account made with your `@wearehackerone.com` address. Participants sign a confidentiality agreement. The box says "linking your write-ups", but the form has no link field (two short written answers). HackerOne is not taught until Step 10; this box is in Step 6.
- Proof: Anthropic's page fetched by me today ("You must use your @wearehackerone.com email alias to create a Claude Console account", "required to sign a non-disclosure agreement").
- Smallest fix: rewrite the three steps to match the form.

**A13. The GitHub check can be shut out for an hour at a time on a shared network.** New. Lower.
- What: GitHub allows about 60 checks an hour per network without an account. On shared camp Wi-Fi others can use them up. The app's message does say so and says to try later.
- Proof: by reading the code (`app.js` 2666, 2868). GitHub's own counter for this PC's network showed 60 an hour, 52 left after my few checks.
- Smallest fix: add "or switch to your phone's data" to the message.

### B. Things that can lose or spoil your progress

**B1. A link can swap your private linking code, and the sender can then wipe your ticks.** New.
- What: an old way of linking still works: any address ending `#sync=<32 letters>` joins that code at once. No question is asked. Your own private code is replaced and lost. Your ticks are uploaded to the sender's spot and theirs are mixed into yours. The sender can then clear everything on your device with one number.
- Where: `app.js` lines 4197 to 4206.
- Proof: checked by me in a throwaway browser with a pretend store (`out/lead_tests.txt`): "his private code is now THE OTHER PERSON'S", then "0 OF 107 DONE".
- Smallest fix: ask "Link this device to another set of ticks?" before joining, or remove the old link. Nothing in the app makes such links any more.

**B2. "Load this code" wipes your ticks with no warning.** New.
- What: loading a backup code replaces everything; it does not add. An old code wipes newer ticks, on this device and on every linked device. There is no "are you sure" (the Clear button has one). The message says "Loaded. Your ticks are back." The screen never says "replaces".
- Where: `app.js` lines 3730 to 3734 and 3797 to 3813.
- Proof: checked by me: 5 ticks became 1, on the device and in the store.
- Smallest fix: a confirm step that says how many ticks will be replaced, and one sentence on the screen.

**B3. Your rotation can flip, and all your marks get one time, after a backup or a first link.** New.
- What: saving a new rotation date never clears the old one. The newest wins. But loading a backup, or first linking with a device that had pressed "clear all", stamps every mark with the same time. The tie goes to the lowest number, so the rotation can jump back to an old setting. Review timing restarts too (a quiz passed 10 days ago looked 1 day old).
- Where: `app.js` lines 3756 to 3763, 3187 to 3191, 1922 to 1940, 3806 to 3808.
- Proof: checked by me twice: "day 6" became "day 13" (`out/lead_tests.txt`).
- Smallest fix: when a rotation is saved, untick the other 20 rotation marks.

**B4. If the quiz file fails to load once, an unlinked device forgets quiz passes for good.** New.
- What: on a bad connection the page can load without `quizzes.js`. The app then does not know the quiz and review marks, drops them, and the next save writes them out of existence. In that state every course box also shows "I'm done" with no quiz. A linked device gets the marks back from the store; an unlinked one does not.
- Where: `app.js` lines 1659 to 1673 (the known list depends on the quiz file) and 1693 (unknown ids dropped).
- Proof: checked by me: after one tap on "Switch to light", `qzfc1`, `r1fc1` and `r1v1` were gone; box fc2 offered "I'm done ✓".
- Smallest fix: keep marks the app does not know instead of dropping them (already an idea in `IDEAS.md`), and do not offer "I'm done" on a quiz box when the quiz file did not load.

**B5. The online store accepts more than numbers, from anyone.** New. Needs your Firebase account.
- What: the store has no accounts, by design. Its rules do refuse listing, text in place of a number, and odd shapes. But a whole record can be replaced by free text (I stored 200 KB), a 33-letter code is accepted, and 20,000 made-up marks went in at once. So anyone can park text there or fill the free quota until linking stops. `AUDIT.md` says the store refuses anything but numbers.
- Proof: checked by me with a throwaway code, deleted afterwards (`out/store_probe.txt`).
- Smallest fix: three rule lines (a record must be an object; the code exactly 32 letters; a cap on marks). I cannot see or change the rules: your answer needed (Q2).

**B6. Small linking edges.** New. Low.
- A device whose clock runs slow, and that is offline while another device clears all, loses a change it makes after the clear (checked by me with a 2-hour-slow clock).
- The limit of 5 review questions a day is counted per device, so two devices allow 10.
- A missed review question "comes back tomorrow" on the screen, but returns 24 hours after the miss: not offered the next morning (checked by me: not at 13 or 23 hours, yes at 25). Fix the wording or use the next calendar day.

### C. Things that teach you wrong or are out of date

**C1. The OWASP list is one edition old.** Was A5. Confirmed.
- OWASP's 2026 list: 01 Prompt Injection, 02 Sensitive Information Disclosure, 03 Excessive Agency, 04 Supply Chain, 05 Data and Model Poisoning, 06 Unbounded Consumption, 07 Misinformation, 08 Hidden Context Exposure, 09 Vector and Embedding Weaknesses, 10 Improper Output Handling. Box wb5 (`app.js` line 466), 6 of its 8 quiz answers, Library lesson t34, three source labels, `AUDIT.md` line 77 and `SCOPE-2-GAPS.md` use 2025 numbers. Every wb5 hint also names the answer's number.
- Proof: page fetched by me today (`pages/lead-owasp-2026.html`).
- Fix: your decision 2.

**C2. PortSwigger's Web LLM attacks has 8 labs, not 4.** Was A6. Confirmed, with a correction.
- Box ag2 says "all 4 labs" (`app.js` line 493). The 4 new labs sit under a sub-topic and have no published solution yet ("will be published shortly"), so "read the lab's own solution" cannot be followed for them. Seen by two helpers in a browser and by the last audit in Chrome; not re-opened by me.
- Fix: decision 2 (all 8, hours raised, new questions).

**C3. Library lesson t29 sends you to a bounty that ended.** New.
- It names "Anthropic's own AI safety bounty" as a place to start and says each was "checked on 18 Nov 2026" (`app.js` line 1228). Its source page says: "The bug bounty program in this post has concluded" (May 2025). The live program is the one box b4 links: by application, with a confidentiality agreement.
- Proof: page fetched by me today.
- Smallest fix: point t29 at the live program page and say who it is for.

**C4. freeCodeCamp: the AI pledge is not mentioned, and box fc1 names the wrong setting.** First part was A7. Confirmed. Second part new.
- To claim the certificate you pledge you "did not use AI tools to generate my solution". The app is silent (it does warn for Harvard's CS50P). Box fc1 says "make your profile public" (`app.js` line 369); a new profile is public already. What hides a certificate is an empty name and the "My certifications" and "My timeline" settings (helper, from freeCodeCamp's own code).
- Smallest fix: two sentences.

**C5. Quiz answers that are wrong, or have a second right answer.** New.
- fc3 q7: marks `pass` as the only body that lets the file run. `return` and `None` run too (run by me).
- ap3 q8: the "wrong" fix `Change "plum" to "PLU"` also prints 1 (checked by me).
- ag5 q1: "3.11 to 3.15" is wrong for the released PyRIT (checked by me on PyPI).
- wb3 q8: says DOM-based XSS "needs no server response at all"; PortSwigger's own page describes reflected and stored DOM XSS (helper).
- pd5 q2: applies OpenAI's "50% of the time" line to every report; the page applies it to one kind (helper; the last audit said the same of the box).
- pd5 q7 and pd1 q2: a second option is arguably right (helper).
- Video quiz ep10 Q8: "backtrack = how many refusals before it gives up" is the video's line but not what PyRIT does. ep5 Q7 marks wrong something research shows is true. Five video questions use PyRIT's old word "orchestrator"; today's PyRIT calls them "attacks", and no word links the two (helper, `helpers/quiz-videos-words.md`). These are Steps 1 to 6: your answer needed before changing them (Q6).
- All other marked answers are right: 428 questions read, every code question run again by helpers on Python 3.12.10, shell questions run on real Linux too.

**C6. Lab pages: four untrue lines.** New.
- Lab 7, hint 2 says the chatbot "may stay silent" (`app.js` line 1433). The lab's own settings say never to abstain.
- Lab 10's page says the lab "shows you its hidden instructions" (line 1478). Microsoft's file sets `Challenge__MetapromptLeak=false` for every lab (file fetched by me).
- `labs/SETUP.md`, `labs/Dockerfile.fixed` and `AUDIT.md` cite issue 33 for the "404 Not Found". Issue 33 is about an SSL failure (title read by me today). The 404 is in pull request 69.
- The "How to think" text gives the move away before the hints in labs 8, 11 and 12; Lab 2's hint 1 steers away from what won (helper). Rewording hints is more than a fact fix: your answer needed (Q6).

**C7. The Library: 23 of 36 lessons have findings, most small.** New. Full list in `helpers/library.md`.
- t13 says nothing stops repeated automated attacks "in a lab on your own computer"; the labs run on your OpenAI key, so its rules and your money are on the line. This contradicts the app's own Rule 3.
- t37's question marks a swearing jailbreak as a 0DIN finding; 0DIN rates that "minimal risk" and wants a jailbreak shown in at least two testing categories.
- t24 uses Anthropic's "agentic misalignment" study as proof agents can be steered; the study is about models misbehaving on their own.
- t36 teaches changing `id=500` to `id=501` with no "only on labs or in scope" line. t34 lacks one too.
- t14 and t17 describe filters as judging one message at a time; newer ones read the whole conversation.
- t26 says reputation "grows with each accepted report"; HackerOne also takes points away.
- Sources that do not back their lesson: t6, t18, t27, and smaller ones in t1, t4, t8, t25, t33, t35.
- Every named technique checked out on author and year. Every lesson question has one right answer. No lesson gives a working attack on a real product.

**C8. The word list: one contradiction, three muddles, 15 missing words.** New.
- Word 12 defines AI red teaming as "attacking an AI system"; quiz ep1 Q4 marks that view wrong.
- One flaw has three names (word 37 "Unsafe output handling", lesson t34 "Insecure", OWASP "Improper"). "Threat model" is defined three ways.
- Seven words are in the list twice (Agent, Excessive agency, Data exfiltration, RAG, MCP, Threat model, Scope), so "84 words" is 77 different words (checked by me).
- Missing words the videos use: spotlighting, base64, API key, skeleton key, orchestrator/attack, converter, scorer, target, fabrication, virtual environment and pip, Docker, and four more (`helpers/quiz-videos-words.md`).

**C9. Box text that is only partly true.** Mostly was section C in the last audit. Each read on the official page today by a helper; I re-checked the ones marked.
- g6 (Gray Swan "Lucky Break: Level Up") is a finished prize contest, not free practice. New.
- p1: Microsoft's help calls the button "Share link" and mentions no access code. New.
- a2 overstates what the Lab 1 notebook does (one prompt, no scoring). New.
- m0: OpenAI's smallest credit is US$5 but the form starts at US$10, and auto-reload is on by default (checked by me; see D1).
- b1, b3: 0DIN pays nothing for prompt extraction and wants jailbreaks shown in two categories. New.
- lx1: the page gives no ready command; it is `ssh bandit0@bandit.labs.overthewire.org -p 2220`. The host answers on that port (checked by me, no login). "Keep solutions to yourself" is stricter than OverTheWire's rule (no passwords).
- ap1: the Windows key steps are on another Google page; you must open a new terminal after setting the key. Google's quick-start now uses `client.interactions.create` with the model `gemini-4-hydrogen` (checked by me). Free-tier prompts are used to improve Google's products and "human reviewers may read" them (checked by me): the box is silent. New.
- md1 to md7: "they need paid Azure" is too strong (a free local route exists). The seven boxes cover 11 lessons.
- md7: agents lesson 18 is "Securing AI Agents with Cryptographic Receipts" (checked by me): signed records, not defences against injection.
- wb4: its labs are mostly a level harder than the two boxes before it; the box does not say.
- c50: needs a GitHub account too; Harvard says 10 to 20 hours a week for 10 weeks (the box says 60 hours); the course deadline is 30 June 2027; the paid edX certificate is US$299.
- pd5: "All four are open to people in Canada (checked ...)" overstates it for OpenAI; "OpenAI, Google and Microsoft pay for security impact through agents" is not right for Microsoft.
- tl2: HackerOne's page lists different report sections from the box.
- pd1: the plan promised Microsoft's safe harbor page; it is not in the box.
- Hours: the freeCodeCamp boxes look 3 times too high by a helper's estimate (about 48 hours against 144 for Step 7), and md3 to md6 about 3 times too high by word count. This is a judgement; freeCodeCamp gives no hours per module. Your answer needed (Q10).
- Labels: ag1, tl2, tl3, tl4, pd6 and pd7 have no "needs your PC" or "shift week OK" label; pd7 has no time.

**C10. Wording on screen that is not right.** Partly was E.
- Course-box quizzes say "where in the video to look", "Rewatch these moments" and "You can tick this video" (`app.js` lines 2569, 2581, 2622). Checked by me.
- Settings says what is stored online is ticks, hints, lab results and days, "nothing else about you" (line 3700). The app also stores quiz passes, review results, your rotation and the last time you studied on each weekday. Checked by me.
- The Library says "Every page was opened on 18 Nov 2026" (line 4049); 15 of its sources were added on 27 Nov.

### D. Things that could cost you money or trouble

**D1. OpenAI turns auto-reload on by default.** New.
- OpenAI's help page: "The minimum purchase is $5, and the default amount is $10 ... auto-reload ... is turned on by default during setup." Nothing in box m0 or `labs/SETUP.md` says to switch it off. The harmful-goal labs (3, 4, 9, 10) aim at content OpenAI's rules forbid; the app says only that its "rules still apply".
- Proof: page fetched by me today.
- Smallest fix: two sentences in the set-up box and guide.

**D2. Two contract platforms named in Step 13 need a caution.** New.
- Vettedlance: its terms say "governed by the laws of [to be confirmed by counsel]" (checked by me). It takes ID and a camera interview. Its domain is from March 2026. No sign of a fee or a scam.
- Alignerr: its FAQ says "we only accept US Driver's Licenses, US State IDs, US Work Permits or US Permanent Residence Cards for identity verification" (checked by me). The Jobs screen already carries this caution; box pd4 does not.
- Syntony's domain is from July 2026 (helper).
- Smallest fix: one caution line each in pd4: do not send ID until you have asked.

**D3. Jobs: the ads are real, but the tools around them have faults.** New. Full list in `helpers/jobs.md`.
- All 26 open ads are really posted today. None asks for a fee, a deposit, crypto or a messaging app.
- The location tagger marks "Remote (Canada excluded)", "not available in Canada" and "no Canada" as open to Canada (checked by me; `tools/find_jobs.py` lines 30 to 33). No ad today is affected.
- Two feeds are other companies: `cais` is an investment firm in New York, not the Center for AI Safety; `patronus` is a Berlin firm with German-speaking jobs (both checked by me; `tools/job_feeds.py` lines 39 and 54).
- "A daily check hides an ad when it closes" is only partly true: a site that blocks the check keeps its ad showing, and some open ads can be hidden by mistake. One bad feed stops a whole run.
- Feed text cannot run as code (tested with a hostile fake feed), but pay text and links are copied as they come: a fake "pay a fee" line would show.
- Small: the UK residency closing date is 13 Dec, not 8; two Clera cards say "Pay not stated" though the ads state pay; "about 20 AI companies" is 34 boards. The 2 dead ads in the file are already hidden, as they should be.
- `tools/jobs_test.py` kept saying "ALL PASSED" when the tools were broken on purpose.

**D4. Your personal details are public on GitHub.** New. Your decision.
- Your personal email address is the author of 102 public commits. The records in the public repository say personal things about you (each place is listed with file and line in `helpers/records.md`, section 7, in the audit folder, which is not public). `AUDIT-FULL-PROMPT.md` holds the same kind of details and is not published: `tools/ship.sh` adds every new file, so it is held back on this PC (one line in `.git/info/exclude`) until you decide.
- No key, token or private code is anywhere in the history (2.3 MB scanned by me).
- Your answer needed (Q3, Q4).

### E. Proof that is weaker than it reads

**E1. Every GitHub check passes on nonsense.** Was B1. Confirmed by me.
- ap1 with only the comment `# generate_content` passes ("calls a model"). ag4 passes on a 3-line file typed by hand ("ran against a real model (openai)"). tl1 passes on `# click` and counts every commit in the repository. tl2 passes on five words. An empty `score.py` passes ap3. (`out/lead_tests.txt`.)
- The lab-proof has the same weakness: a three-message file typed by hand in the "after reload" shape passes, and the pass message says "the file is real" (checked by me). Lab 6 can show "The chatbot carried out the command you hid" when no command was hidden (helper).
- Fix: your decision 4.

**E2. A quiz retry asks only the missed questions, with the same options.** Was B2. Confirmed by me ("Answer the 8 I missed again").
- Fix: your decision 3.

**E3. Many questions can be guessed, and some hand over the answer.** Was B3. Confirmed, and wider.
- Steps 11 to 13: about 70 of 99 questions can be guessed; the right answer is the longest option 59% of the time. Steps 8 to 10: always picking the second-longest option passes wb4, md1 and md4. freeCodeCamp part 2: fc12, fc14 and fc15 can be passed on length and common sense. The builder guards only "always longest" and "always shortest"; padded wrong options get under it. The video quizzes are the best: the right answer is never the longest.
- Hints that give the answer away: wb5 q2 to q8, ag3 q5, ag5 q2, tl3 q6, pd5 q7, fc12 q6, fc2 q6 and about ten more. The builder's hint guard is skipped for 110 of the 364 questions.
- Certificate-project quizzes show working pieces of freeCodeCamp's own answers: fc8 q5 (`.center()` is the solution's own line), fc10 q5, fc12 q3 and q6, fc15 q5 (its hint gives the whole method and says the page teaches it; it does not). This sits badly with the pledge in C4.
- Questions on things not yet taught: fc8 q5, fc8 q8, fc11 q4, fc16 q5, fc18 q1, lx1 q7; ag5 q3 to q8 use a page the box never names.
- Lists by question: `helpers/quiz-fcc-a.md`, `quiz-fcc-b.md`, `quiz-s8-10.md`, `quiz-s11-13.md`.

**E4. Box pd4's quiz rests on five job ads.** Was B4. Confirmed: all open today; each question dies when its ad closes. The box says "four ads"; the quiz quotes five.

**E5. The tests prove less than the records say.** New.
- The walk "through all 107 boxes" fills in every quiz pass and proof first. It proves the order, not the locks. Only about 9 of the 58 newer boxes are tried without their proof (helper, `helpers/records.md`).
- `tools/ship.sh` runs four tests before a release. It does not run the path walk, the two-device test, the link check or the quiz build. Nothing in a release checks that `quizzes.js` is what the build makes (today it is: 428 of 428 match).
- Linking has no test that runs on the PC. The only one uses the live site and the real store, and checks one rotation mark.
- `tools/jobs_test.py` cannot fail for the faults in D3.
- **Breaking the app on purpose** (added after the first report, 27 Nov, 4:05 pm). A helper broke a scratch copy of the app one way at a time, 46 ways, and ran the tests the release script runs (`helpers/mutation.md`). 26 breaks were caught. 20 were not. Five of the 26 were caught only because the test timed out, not by a check that names the fault.
- The 20 that no test noticed, most serious first:
  1. A required lab other than Lab 1 can be finished with no chat file (the test only looks at Lab 1).
  2. A wrong "right answer" in `quizzes.js` passes everything: the test reads the answer from the same file. The quiz build also accepts a wrong answer on any question without code.
  3. The key check can stop seeing OpenAI keys (`sk-`): the test's only key is a Google one.
  4. A missed course-box question can show the right answer (only Episode 1 is checked).
  5. Seven of the 11 GitHub checks are never run by any test (gt1, ap2, ap3, ag5, tl1, tl2, tl3). Four were broken and nothing noticed.
  6. The certificate link box (fc18) can accept any address.
  7. Linking: with other devices ignored, or "clear all" never sent to the store, every local test passes.
  8. A box whose link is dead passes (only the link check would see it, and the release script does not run it).
  9. "I studied today" can tick a box; reviews can come only from videos; the 1-month review can come after 8 days; the 5-a-day limit can go; the on-track finish date can be 7 times too early.
  10. The code that reads the oldest saved progress can be removed; a word can vanish from the word list.
- Two checks are blind: "no sideways scrolling" does not see a fixed bar that is too wide, and "old progress loads unchanged" reads back what the test itself wrote, so it passed with a box renamed and with a box deleted (other checks caught those).
- "344 checks" counts lines, not things proven: 182 of them are the 12 lab pages, and the walk through all 107 boxes is one.
- Since then, fixes 1 to 8 added local tests for linking through a pretend store, the backup code, the quiz file, lab text and link shapes. The rest of this list is fix 23.

### F. Records that are not true

Full list with file and line in `helpers/records.md`. The main ones:
- `README.md` line 86: a device on the older app "cannot make the new marks disappear". The test's own comment says the old app does drop them from the store; they come back because other devices send them again (checked by me).
- "Last audited: 18 Nov 2026" (`README.md` 110, `AUDIT.md` 3, `app.js` 1630). Twenty commit messages cite "the 23 Nov audit"; that day has 33 commits and no report, scope, checklist or time log in the repository.
- `SCOPE.md` 77: "51 boxes" is 50. `README.md` 28: "about 460 hours from Step 2"; the boxes that carry a time add up to 441.9 hours, and Steps 3, 5 and 6 carry none. `README.md` 19: "seven short lessons" are 11. `README.md` 34: "each box says how long it takes and whether it needs your PC" is untrue for six boxes. `README.md` 60 and `AUDIT.md` 15: "about 20" and "22" job boards are 34.
- `README.md` 92 and `PROOF.md` 137 say there was no key on the PC that built this; `PROOF.md` 121 used an OpenAI key on the same PC.
- `AUDIT.md` 14 and 42: the store "refuses anything but numbers" (see B5). `AUDIT.md` 77: the 2025 OWASP list "is still the current one". `AUDIT.md` 82: "Not yet run", four lines above a line that says it was run.
- Dropped promises in the plan, never recorded: garak and PyRIT were to be run against a real model first; ag4 and ag5 were to use a free route; the installs were to be pinned to tested versions; Microsoft's safe harbor page was to be in pd1; two planned words are missing; no usage readings or time log were kept for Scope 2.
- The numbers that are true: 119 boxes, 107 that count, 12 optional, 428 questions (64 + 364), 36 lessons, 84 words, 12 lab pages, 523 saved ids, 114 commits, every hash and tag named.

### G. Ease of use

New. Measured by a helper in 146 screen states (23 screens, both themes, widths 320, 390 and 1280); numbers and fixes in `helpers/ease-of-use.md`. Not tested on a real phone or with a real screen reader.

What passed: no sideways scrolling in any state, no cut-off text, long quiz options and code lines wrap, every control can be reached with Tab and has a name and a visible outline, no ordinary text fails contrast, Escape closes the side panels, and the bottom bar never hides the last line.

What did not:
- **Text cannot be made bigger.** Pinch-zoom is switched off (on purpose, since 18 Nov, because the page got stuck zoomed on iPhone), and the browser's own text-size setting changes almost nothing because sizes are fixed in pixels (`style.css` lines 40, 48; checked by me). With text doubled, the fixed top strip and bottom bar take 94% of a phone screen.
- **Keyboard and screen reader lose their place.** Focus drops to the top of the page after Continue, a screen change, Start quiz, a quiz answer, Watch it here, I'm done and Next. The quiz question, score and "MARKED" message are never read out. The quiz box cannot take focus although the code asks it to (`app.js` 2564, 2579; checked by me).
- **Things hide under the bars.** 57 of 464 Tab stops at phone width land under the top strip or bottom bar, the lab-proof paste box and "Check my chat" button among them. One style rule fixes it.
- **The side panels are not closed off on a phone.** Tab walks out of the open Menu into the page behind it.
- **Faint parts.** Placeholder text (about 4 to 1), the greyed buttons that carry the reason ("Pass the quiz above to finish": 2.9 to 1 in the light theme) and every text-box border (1.3 to 1.5 to 1) are below the usual limits.
- **Small targets and small text.** 227 of 538 tap targets are under 44 px; some links are 20 px tall; "Untick" is 28 px. The smallest text is 10.6 px.
- **Smaller:** typing a note makes a screen reader announce on every key; the "reduce motion" setting is overridden; the page title is the same on every screen; a phone set to light still opens dark the first time; no 192 px icon.

Three things worth trying on a real iPhone: Add to Home Screen in the light theme (clock readable, notch and home bar clear); VoiceOver on a course quiz (is anything spoken after an answer); Safari text at its largest, then the "Explain it back" box with the keyboard up.

### H. Videos that can play inside the app (your approved change)

The inventory, box by box, is in `helpers/videos.md` and `helpers/videos.json` (67 lesson videos). All were tested for "may play inside another page" by the helper; the fix phase tests each one again on the live site at phone size.

- **py1 to py8** (Step 4, Microsoft Learn Python): 40 short videos on Microsoft's own player, the same player Episodes 1 to 4 already use. 6 to 11 minutes a box.
- **md1 to md7** (Step 9): 10 YouTube videos by Microsoft Developer, 6 to 23 minutes each. md3, md5 and md7 have two each. Agents lesson 18 has no video yet (its page holds a placeholder; checked by me), so md7 gets two players, not three.
- **wb2** (PortSwigger): 3 short topic videos, 23 minutes in all.
- **wb6** (Hacker101): 3 newcomer videos, 41 minutes. The playlist on Hacker101's page does not hold "Writing Good Reports", which the box tells you to watch, so the three are added one by one.
- **gt1** (GitHub): one 3-minute "What is GitHub?" video.
- **c50** (Harvard CS50P, optional): 10 lectures, 15 hours 50 minutes, plus a 4-minute introduction.
- **No video**: freeCodeCamp's 65 lecture lessons (text only today), Microsoft Learn's AI security modules s1 to s3, MDN, OWASP, OverTheWire, Google's Gemini pages, garak, PyRIT, Gray Swan, 0DIN, Anthropic, the tax and platform pages, and the lab boxes.
- Hours against video time: no box has more video than its stated time. c50's 60 hours is under its 16 hours of lectures plus Harvard's 10 to 20 hours a week.
- Microsoft's training page now also carries an 11th player at the top (the whole course in one). The 10 episode ids the app uses are unchanged.

### I. Small things

- `how` text on lab boxes ("You are done when the lab says you solved it ... after 45 minutes ... tick it and move on") is never shown on a lab screen, so it harms nobody; it is still untrue for labs with no scorer and for required labs. One line of the thinking steps says the same (`app.js` 1624) and is shown.
- A file of 1 MB of `<!--` freezes the lab-proof box for minutes. Only a hand-made file does this.
- The page has no content security policy. Nothing I found needs one today: every piece of outside text (job feeds, GitHub replies, chat files, notes, the address bar) is put on the page as plain text, never as code. Checked by me (one use of `innerHTML`, on the app's own fixed icons).
- `.claude/done_history.log` is in the public repository (session ids, no secrets).
- `tools/verify_labs.py` can count a refusal that mentions "moon" as a win for labs 5, 6, 11, 12, and records no model name.
- The earlier audit's small items still stand: certificate projects marked "shift week OK"; the key scan reads today's files only, not Git history; fc4 q6 prints `h i` before its error; the 10 video reviews come due together, 5 a day.

---

## 3. Verdicts on every finding of `AUDIT-SCOPE-2.md`

- **A1** (no Git on the PC): confirmed. See A4.
- **A2** (HackerOne address refused): confirmed, in Chrome and by test. Its "also accepts" notes confirmed. See A8.
- **A3** (ag4 hit log): confirmed by test. One correction: garak writes a hit log only when something got through.
- **A4** (garak and PyRIT never run for real; holes in the steps): confirmed, and there are more holes. See A6, A7.
- **A5** (OWASP 2026): confirmed. See C1.
- **A6** (8 labs): confirmed. Correction: the 4 new labs are a sub-topic with no published solutions yet.
- **A7** (freeCodeCamp AI pledge): confirmed. The pledge text in freeCodeCamp's Settings leaves the AI sentence out, but accepting the policy still binds you to it.
- **B1** (GitHub checks pass nonsense): confirmed by test.
- **B2** (retry asks only the missed): confirmed by test.
- **B3** (guessable questions, guard dodged): confirmed, and wider than reported (Steps 8 to 10 and freeCodeCamp too). Of its "quote is only a heading" list: fc13 q6 and q8 confirmed; fc14 q3 and fc16 q8 are real sentences that still do not back the answer; md3 q5 confirmed.
- **B4** (pd4 quiz on job ads): confirmed. Five ads, not six, are quoted.
- **B5** (editing saved data; "Explain it back" not graded): confirmed by reading. Not a fault.
- **C, first table**: fc1 confirmed and worse (wrong setting named). fc18, Step 7 "300 hours", the three c50 rows, both lx1 rows, ap1, md1 to md7, md7 lesson 18, md3 and md5 hours, ag1, ag5 q1: all confirmed. **wb6 is wrong**: HackerOne's own help page does state the 26-point line. **wb4 needs a correction**: the path the box links has 4 labs (1 Apprentice, 3 Practitioner); the Expert lab is only in the full topic.
- **C, second table**: pd5 (three rows), tl2, tl3, pd2, pd3 confirmed. pd4 partly: micro1 is no longer named in the box, and Alignerr does use an AI interview.
- **D**: the stale PyRIT line, the OWASP line and the garbled time in `SCOPE.md` confirmed. One slip: the "confirmed by running it" promise is in `SCOPE-2-PLAN.md` line 138, not `SCOPE.md`. "Everything else I checked ... matched" does not hold (see F).
- **E**: all confirmed. Add `app.js` line 2569 to the "video" wording.
- Its "checked and found sound" list: confirmed again today (old progress, tests, safety text), except that "no right answer is wrong" misses fc3 q7, ap3 q8 and ag5 q1, and "the real finished copy of GitHub's exercise" it saved was the template itself. I ran the real check on two strangers' finished copies today and it passes.

---

## 4. What I checked and found sound

1. **Saved progress across all four versions.** I ran each tag's own code and listed every id it knows: 86, 146, 180 and 523. No id is missing today, none changed from a box to a mark or back, and the old 49 required boxes keep their order (`out/ids_by_tag.txt`).
2. **Every test, today.** `node --check`, lab-proof 86, jobs 31, phone test 344 on the PC and 344 live, path walk 118 live, two-device test 14 live, 232 links with 0 dead (4 refuse scripts), and a fresh quiz build that keeps every question. The six live files equal the pushed ones (`out/tests_summary.txt`).
3. **Linking, the hard cases.** Three devices on one code, one of them offline for a month: all three end with the same marks. "Clear all" racing an offline change: all three agree afterwards, and a change made after the clear survives. A pairing code works once, must carry the store's own time, and is refused after 10 minutes (handed out at 10.0, refused at 10.3). The store cannot be listed by anyone (`out/lead_tests.txt`, `out/store_probe.txt`).
4. **Time.** The rotation is right on day 14, 15, 21, 22 and for a date in the future. The streak counts 4 of 4 days across both daylight-saving changes.
5. **The app's own security.** Nothing from saved data, notes, chat files, GitHub replies, job feeds or the address bar is put on the page as code. No key or token is in the repository or its history. The app contacts only the store (when linked), GitHub (when you press Check) and a video player (when you press Watch). No trackers, no fonts from outside.
6. **The real GitHub check.** Against the real GitHub, two strangers' finished copies of GitHub's exercise pass all three lines, four unfinished ones fail correctly, and all 12 finished front pages I read carry the words the app looks for (`out/real_gt1.txt`).
7. **Quiz quotes.** Every one of the 364 newer quotes was fetched again today by helpers, including all the freeCodeCamp ones the last audit only sampled: all are on the live pages word for word. All 64 video quotes are in the subtitles.
8. **Steps 1 to 6 facts that hold.** All 10 episode titles, order and players. Microsoft's lab repository: unchanged since 7 Oct 2025, same 12 labs. All 11 Microsoft Learn modules, their minutes and badges. Docker is free for personal use. Gray Swan sets g1 to g5. 0DIN is run by Mozilla and open to Canada. Anthropic's program is open and has no country rule.
9. **Steps 7 to 14 facts that hold.** All 18 freeCodeCamp addresses and the 5 projects. GitHub's exercise and its name. Bandit's host and port. The Gemini free tier and Canada. PortSwigger is free; the MCP topic has 6 labs. garak 0.17.1 and PyRIT 1.2.1 are the newest. The IRS, CRA, HackerOne and Bugcrowd quotes. The payout ranges (Microsoft US$100 to 30,000; 0DIN US$500 to 15,000).
10. **Safety.** No box or question rewards testing outside a program's scope or mishandling a key. Tax text quotes official pages and says it is not advice.

---

## 5. Gaps in the curriculum, most important first

"Fix now" means an error in what exists. "New idea" goes to `IDEAS.md` and is not built.

1. **Git on your PC.** Fix now (A4).
2. **One real, working run of garak and PyRIT on a free model.** Fix now (A6, A7).
3. **The 4 new PortSwigger agent labs and the 2026 OWASP list.** Fix now (C1, C2). This is the newest material on exactly what pays.
4. **A Python virtual environment is used but never taught**, and no box says which Python to keep (3.12 or 3.13 today). Fix now (A5, A6).
5. **Box b4 comes before HackerOne is taught.** Fix now by text (A12).
6. **Privacy of free-tier prompts** (Google may read them): one line. Fix now (C9).
7. **Is 144 hours of Python before any new security work wise?** My view: no, not for 17 hours a week. Step 9 (how models work) needs no code and suits shift nights, and Step 10's reading boxes need none either. Mixing them into the Python weeks would keep security in view and bring the skills that pay forward. This changes the order of Steps 7 to 14. New idea.
8. **Hours you can trust.** The app's Python hours may be 3 times high. After fc1 and fc2 the app could measure your own pace and re-date the plan. New idea.
9. **Gray Swan's new free Training page with certificates** fits your rule on real certificates. New idea.
10. **A way to keep the path current.** OWASP, PortSwigger, PyRIT, garak and OpenAI's model list all moved within weeks. A monthly re-check of the sources that move, like the daily job check. New idea (a weekly link check is already in `IDEAS.md`).
11. **Canadian law in one line** in box pd1 (testing without permission is an offence in Canada too). New idea.
12. **A one-page resume; records for tax time; a nudge toward a first real report.** From the last audit. New ideas. (On 27 Nov you chose not to have a resume box; it stays in `IDEAS.md` for you to pick or drop.)
13. **OWASP's Top 10 for Agentic Applications 2026** fits Step 11. New idea.
14. **A text-size setting**, since pinch-zoom is switched off on purpose. New idea.

---

## 6. What I could not check, and why

- **A real phone and a real screen reader.** Only a phone-sized desktop browser was used.
- **A live lab.** No lab was run: it costs money on your OpenAI key. The lab-proof findings were built from the real saved chats and Microsoft's code.
- **garak and PyRIT against a real model.** That is the fix phase, on a free model (your decision 1).
- **Your first Gemini call.** It needs your key.
- **Pages behind a sign-in**: Gray Swan's finished sets, the Microsoft Learn transcript screen, PortSwigger's signed-in lab pages, freeCodeCamp's Settings labels and exam app, the CS50 gradebook.
- **Your weekly usage.** Chrome is not allowed to open Claude's settings page.
- **Your real progress.** By rule I did not open the live site in your Chrome. Nothing was read from it or written to it.
- **The store's rules themselves.** I could only test them from outside.
- **The long tail of helper findings.** I re-checked every finding in sections A, B and D that I call wrong, and the worst of C. The smaller part-true rows in C7 to C9 and the per-question lists in E3 rest on the helper's saved pages; each helper file says where.
- **Hour estimates** remain judgements.

How it was done: I read the saving, linking, quiz, proof, timing and settings code line by line and wrote my own tests (throwaway browsers, a pretend store, a pretend GitHub). Sixteen helper sessions on cheaper models read the official pages and saved them. One helper made a single request to github.com with your GitHub username in the address (your repository's public Actions page). My throwaway records in the real store were deleted.

---

## 7. The fix plan

Rules: tag `before-audit-fixes` first. One fix at a time. Each gets a test that fails without it and passes with it, then `tools/ship.sh`, then a look at the live site. No id is renamed, reused or removed. Quizzes you already passed stay passed.

In order:

1. **B1** the `#sync=` link asks first.
2. **B2** "Load this code" asks first and says it replaces.
3. **B3** one rotation mark at a time.
4. **B4** unknown marks are kept, not dropped; no "I'm done" on a quiz box without its quiz file.
5. **A2** the lab-proof checker stops refusing honest wins; its messages say what to do; its pass message stops claiming more than it checked. New test cases.
6. **A1, A3, D1, C6** lab text: the GPT-4o date and the line to change; "download your chat before you stop the labs" (app and script); auto-reload; lab 7 hint 2; lab 10; issue 33.
7. **A5, A11, A12, C3, C9 (Steps 1 to 6 rows)** facts only: Python versions on a1; a3's missing lines; b4's steps; t29; g6; p1; a2; m0; 0DIN's two rules.
8. **A8** HackerOne and Bugcrowd address patterns.
9. **A9, A10** the key pattern; ap3's counting rule.
10. **A13, B6, C10** wording: the rate-limit message, "tomorrow", "video" on course boxes, what is stored online, the source date.
11. **E2** quizzes strict: a retry asks everything again in a new order (decision 3).
12. **C5, E3** wrong and double-answer questions fixed; give-away hints fixed; project quizzes stop showing solution lines; guessable options rewritten (Steps 8 to 14 first); the builder's guards tightened to "longest or second longest" and to every question.
13. **A4** Git on your PC with GitHub Desktop (decision 5).
14. **E1** GitHub checks tightened, each with a nonsense repository that now fails and an honest one that still passes (decision 4). **A7** the garak report choice.
15. **C1** OWASP 2026: box wb5, its 8 questions, lesson t34, labels, records (decision 2).
16. **C2** PortSwigger's 8 labs: box ag2, hours, new questions (decision 2).
17. **A6, A7** garak and PyRIT run for real on a free model on your PC; steps rewritten from what worked; a "make a virtual environment" step; versions pinned; `PROOF.md` updated (decision 1).
18. **C4, C9 (Steps 7 to 14 rows), D2** box text: the freeCodeCamp pledge and settings; lx1; ap1 and the Gemini privacy line; md1 to md7; wb4; c50; pd1; pd4's cautions; pd5; tl2; labels and the missing time.
19. **C7, C8** Library lessons and words, including the missing words.
20. **H** videos inside the app for py1 to py8, md1 to md7, wb2, wb6, gt1 and c50; `tools/walk_test.py` extended to play each one on the live site at phone size; hours re-checked.
21. **D3** Jobs tools: the Canada tagger, the two wrong feeds, closed-ad detection, a test that can fail.
22. **G** ease-of-use fixes.
23. **E5** tests that can fail for what the records claim.
24. **F** records made true: `README.md`, `AUDIT.md`, `PROOF.md`, `SCOPE.md`.
25. Every test again, local and live; tag `audit-fixes-done`; the fix log at the end of this file.

New ideas go to `IDEAS.md` (section 5, items 7 to 14), built by nobody until you pick.

**Needs your answer first:**

- **Q0.** Your weekly usage number today, before any fix.
- **Q1.** GPT-4o ends 14 Jan 2027. Add the warning now (free). Do you also want the 8 lab answers re-tested on OpenAI's newer model? That uses your paid OpenAI key (a few dollars).
- **Q2.** The store's rules: I write three rule lines; you paste them into your Firebase console. Yes or no?
- **Q3.** Your personal email is on 102 public commits. Switch future commits to GitHub's private address (a setting on your GitHub account plus one line on this PC)? The old commits would stay unless you want history rewritten, which I do not advise.
- **Q4.** The records in the public repository describe you. Keep them public, or keep the prompt and audit files out of the repository from now on? `AUDIT-FULL-PROMPT.md` goes public with the first fix unless you say no. This report holds no personal details.
- **Q5.** Add "Moving on, not solved" to the 8 required labs? It changes how Step 1 works.
- **Q6.** Steps 1 to 6, beyond facts: reword the hints that give the move away (labs 2, 8, 11, 12), and add a note to the five video questions that say "orchestrator"?
- **Q7.** Box a3: run Microsoft's Lab 5 notebook to the end once on your key (cents to a few dollars), or only add the missing lines?
- **Q8.** Box g6 is a finished contest. Keep it with a note, or point it at another free Gray Swan set? (The id stays either way.)
- **Q9.** Have you set up a free Gemini key yourself? If not, garak and PyRIT are run on a small free model on your PC only.
- **Q10.** Hours on the freeCodeCamp boxes may be 3 times high. Leave them, or lower them now?

---

## 8. Fix log (in progress: 8 of 25 done, paused 27 Nov 2026, 4:16 pm Alberta)

Each fix: the finding, the commit, the proof. Every fix was shipped with `tools/ship.sh` (local test, push, live file compared, live test). "Failed before" means the new checks were run against the live site before the change went out.

1. **B1, a `#sync=` link asks first.** Commit d46ed3a. 5 new checks, 2 failed before. Live: 349 checks passed.
2. **B2, "Load this code" asks first and says it replaces.** Commit c1648df. 8 new checks, 4 failed before. Live: 357.
3. **B3, the rotation survives a backup load and a first link.** Commit d38e5b3. 5 new checks, 4 failed before, one of them a first link through a pretend store. Live: 362. Left: review timing still restarts after a backup load or a first link after a clear, because every mark is restamped then.
4. **B4, unknown marks are kept; nothing can be ticked when the quiz file did not load.** Commit 5675cdf. 6 new checks, 4 failed before. Live: 368.
5. **A2, the lab-proof checker stops refusing honest wins.** Commit bb92a4f. `tools/proof_test.js`: 109 cases (23 new, 21 fail on the old checker). The audit's attack cases: honest wins refused 26 to 12, cheats passing 37 to 31, none newly passing. Left: a file typed by hand in the after-reload shape still passes; 9 rarer honest cases are still refused (an injection whose result shares no word with it, a chat saved in the second before the lab finished writing its record, and similar: listed in `helpers/fix5-lab-proof.md`).
6. **A1, A3, D1, C6, lab text.** Commit 7dd1af7. 5 new checks, all failed before. Live: 373. The GPT-4o date and the line to change; "download your chat before you stop the labs" on every required lab, in the guide and in the Stop script; auto-reload; OpenAI's own words on losing access; Lab 7 hint 2; Lab 10; pull request 69 in place of issue 33. Left, waiting on your answers: a "Moving on, not solved" button (Q5), a re-test on a newer model (Q1), rewording hints that give the move away (Q6).
8. **A8, a real HackerOne address is accepted.** Commit b42c029. 6 new checks, 3 failed before. Live: 379. The example address, pages that are not a profile and the dead `www` form are now refused.
9. **A9 and A10, the API-key check and box ap3's counting rule.** Commit 4363507. 8 new checks, 5 failed before. Live: 387.

Also done, not a fix yet: garak and PyRIT were run for real on free local models on this PC (decision 1). Both worked with no key. The exact steps are in `helpers/real-runs.md` in the audit folder and go into boxes ag4 and ag5 at fix 17. One line of finding A6 was corrected from that run.

Not started: fixes 7 and 10 to 25 (section 7). Nothing in this list has been left unfixed on purpose except where "Left" says so.
