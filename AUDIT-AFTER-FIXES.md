# Audit after the Scope 3 fixes

Done the night of 27 to 28 Nov 2026 by a fresh session (Claude Opus 5.5) that did not build the app and did not make the fixes. Nothing in the app, its tests, its question files or its records was changed while auditing. This file is the only new file in the repository.

"The audit folder" means `~\redteam\learn\audit\after-fixes-2026-11-27\` : every script, output, saved page and helper note behind this report is there (`scripts\`, `out\`, `pages\`, `helpers\`). Box ids (`ap1`, `m2`) are the names the app uses for boxes. Three helpers did the long reading: quiz questions (`helpers\quiz-after.md`), lesson videos and box text (`helpers\videos-text.md`), and the Jobs tools (`helpers\jobs-after.md`). I re-checked each of their worst findings myself before putting it here.

## 1. Five lines for a phone

1. **The app works and your progress is safe.** Every test passes on your PC and on the live site: 487 app checks, 109 lab-proof cases, 47 jobs cases, the quiz build, the full walk (all 68 lesson videos played live), the two-device test through the real store, 294 links with none dead.
2. **One step can stop you.** Box ap1 has you make an empty GitHub repository, and an empty one has no "Code" button for the next step.
3. **Jobs: one fault made tonight, one missed by fix 21.** Taking your city out of the public files also took it out of the Canada test, so an ad that names only your city is now hidden. The daily check would hide an open ad that says "until the position is filled". No ad listed today is hit.
4. **Quizzes and small app faults.** No quiz answer is wrong, but the new "orchestrator" note gives away two video answers and the 8 OWASP questions can be passed by matching words. Enter in the GitHub box shows nothing. The "Moving on" button does not appear by itself after 45 minutes. With large text on a small phone, the two bars cover the lesson.
5. **Waiting on you.** The store rules are not pasted yet (the test still shows its 5 FAIL lines, as expected). Three records are out of date. Nothing here needs money or your keys.

---

## 2. Findings, most serious first

### Broken now

**1. Jobs: an ad whose location is only your city's name (or your city and province, written out) is hidden.** Made tonight by item 26 (Q4, commit 962b99e), which took the city's name out of `tools/find_jobs.py`. The city is not named here, for the same reason.
- Where: `tools/find_jobs.py:33-37` (`canada_from`). The city left the "yes" line but was not added to the "check" line of Canadian cities, so it falls through to "hidden".
- Proof: run tonight, `canada_from("<city>")` and `canada_from("<city>, <province written out>")` both give `no` (hidden); the same function from the commit before 962b99e gives `yes` for both. `"<city>, AB"` gives `check` only because of the two province letters, and that is the one case `tools/jobs_test.py:11` tests. The commit message says the opposite ("an ad naming only that city is now 'check'"). Province names alone ("Ontario", "British Columbia" and the rest) were hidden before tonight too.
- Who it hits: the weekly scan, next run Monday 30 Nov. An ad in your own city could be hidden from you.
- Smallest fix: put the city back in the Canadian-city "check" line among the others, with the province names and a few more cities (saskatoon, regina, mississauga, burnaby, kelowna), and add the two failing forms to `tools/jobs_test.py`. One city in a list of ten says nothing about where you live.

**2. Box ap1: the repository it has you make is empty, and an empty repository has no "Code" button.** Fix 13's steps were written from GitHub's help pages, never run.
- Where: box ap1, step 3: "On GitHub, make a new public repository called red-team-tools." Step 4: "On your repository's GitHub page press Code, then Open with GitHub Desktop." Nothing says to tick "Add a README file", and GitHub leaves it unticked.
- Proof: GitHub's own page (docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository, saved in `pages\videos-text\`): "An empty repository contains no files. It's often made if you don't initialize the repository with a README", and for an empty one: "to clone your repository in Desktop, click Set up in Desktop". The helper also notes the first push from an empty repository may say "Publish branch" rather than step 7's "Push origin"; that part was not run.
- Who it hits: you, at the first Git box of Step 8, following the steps word for word.
- Smallest fix: step 3 becomes "make a new public repository called red-team-tools, and tick Add a README file".

**3. Jobs: the daily check would hide an open ad that says "until the position is filled".**
- Where: `tools/check_jobs.py:31-33` (`CLOSED`). Fix 21 taught it that "once a position is filled" is not a closed ad; it skips "until " and "until a " but not "until the ".
- Proof: `CLOSED.search(...)` matches (closed) on "Applications will be reviewed on a rolling basis until the position is filled." and "This posting will remain open until the position is filled.", and on "This position is closed to non-US residents". It misses real closings: "Position filled", "Applications are closed", "Job expired".
- Who it hits: the 8 ads checked by their page rather than a feed. None of tonight's saved ad pages gives a wrong match, so nothing is lost today. Fix 21's code runs for the first time at the daily check of 28 Nov, 13:22 UTC.
- Smallest fix: add `(?<!until the )` to the lookbehinds, refuse "closed to", add the three missing closing phrases, one test case each.

**4. Quizzes: the new "orchestrator" note gives away two video answers.** Made by item 26 (Q6).
- Where: `app.js:2743-2745`. The note shows under a question only when "orchestrator" is in it or its options, and it names `PromptSendingAttack` and `CrescendoAttack`.
- Proof: Episode 8 question 3 asks which part of PyRIT runs "a whole crescendo attack from start to finish", options "A converter / A target / An orchestrator / A scoring engine", and the note under it names `CrescendoAttack`. Episode 9 question 5 asks which part "sends them all in bulk", with "The prompt sending orchestrator" among the options, and the note names `PromptSendingAttack`. 7 video questions carry the note.
- Smallest fix: show the note once above the quiz (or in the episode box), not under each question.

**5. Quizzes: more give-aways and one contradiction** (from the quiz helper; the worst re-read by me):
- wb5 (rebuilt in fix 15): all 8 questions can be answered by matching a word in the question to a word in the option ("hidden system instructions" to "Hidden Context Exposure", "embedding" to "Vector and Embedding Weaknesses"). The facts and the 2026 numbers are right.
- ag4 question 7 says "garak needs an API key for the model you test"; box ag4, rewritten in fix 17, says GPT-2 needs "no key, no account and no money". Checked: both lines as quoted.
- Hints that name the answer: Episode 10 question 8 (Q6's new hint, "Today's PyRIT erases a refused turn and asks again", where the right option is the only one about refusals); pd5 question 3 ("the examples it will not reward" for "Out of scope").
- tl3 question 6: its right answer ("Training labs like PortSwigger's and Microsoft's ...") is not in its saved source and is the longest option by far. wb4 questions 2, 4 and 8: wrong options added in fix 12 give themselves away ("Only", "nothing else at all").
- Smallest fix: rewrite those 13 questions (wb5 as cases that do not repeat the entry's name), and change ag4 Q7 to "If you scan a model that needs a key, where does garak's README say it goes?"

**6. Enter in the GitHub box shows nothing; Enter in a link box does not say "Saved".** Made by fix 22.
- Where: `app.js:3079` (GitHub box) and `app.js:3117` (link box). Enter presses the button but leaves the cursor in the box, and the screen is never redrawn while you are typing in it (the check at `app.js:3320`), so the result list never appears.
- Proof: `scripts\enter_test.py`, with a pretend GitHub (no real GitHub calls). Tapping the button: "✗ GitHub has no public repository like that ..." shows and takes focus. Pressing Enter: the cursor stays in the box, no result shows, and the button never says "Checking…". In box pd2, Enter saves the links (the proof mark is set) but "Saved ✓" never shows. Fix 22's own check only tried Enter with an empty box.
- Smallest fix: in both Enter handlers, take the cursor out of the box before pressing the button (`userIn.blur()`, `x.blur()`).

**7. The "Moving on, not solved" button (Q5): two gaps.** Made by item 26 (Q5).
- It does not appear by itself after 45 minutes. Proof: `scripts\q5_attack.py`, lab 2 open with no hints, its clock set to 44.9 minutes and the screen left alone: no button after the 45 minutes, nor after the page is hidden and shown again; it appears only after leaving the lab and coming back. The page says "after 45 minutes on this lab, you can move on" and does not say to leave and come back.
- The 45 minutes start the first time a lab's page is opened at all, even a peek from the Path list months before you reach it (`app.js:2604`). Proof: opening lab 12 from the start of the path saved its start time; with that time 45 minutes old, lab 12 offered "Moving on, not solved" while still far ahead, and pressing it ticked lab 12 as not solved from the start of the path.
- What works: opening the third hint brings the button at once; moving on ticks the lab as not solved, never beaten; it goes on the "Come back to these" list and the Path list says "NOT SOLVED YET"; a winning chat later turns it to beaten and takes it off the list; Undo clears both marks; the bottom bar always has a button. The 45 minutes are counted per device and not linked, as recorded.
- Smallest fix: start a lab's clock only when it is the box you are on now, and redraw the bottom bar once when its 45 minutes run out.

**8. With large text on a small phone, the top strip and the bottom bar cover the lesson.** Fix 22 made text follow the phone's text size; the two bars grow with it.
- Where: `style.css:227-229` (the top strip stays at the top) and `style.css:279-288` (the bottom bar).
- Proof: `scripts\layout_test.py`, text at 100, 150 and 200 percent, dark and light (`out\layout.txt`, screenshots in `out\layout\`). At normal text size everything fits (390 px wide: the bars take 198 of 844 px on a lab). At 150 percent and 320 px wide, the bars take 456 to 619 of 568 px; on the quiz box screenshot no lesson is visible and the title is cut. At 150 percent and 390 px wide: 431 to 492 of 844 px. Both themes the same. No sideways scrolling at any size.
- Who it hits: only someone who sets large text. On an iPhone, Safari's own text size (the aA menu) zooms the whole page instead, so this mostly matters on Android, or with Safari zoom on a small phone.
- Smallest fix: let the top strip scroll away when the screen is short (`position: static` below a height of about 700 px), and keep the bottom bar's NEXT line to one line.

### Records not true

**R1. README says the Library has 84 words.** It has 92 since fix 19 (`README.md:59`). Proof: the word list in `app.js` holds 92 (`out\library-now.txt`; the app test counts 92).

**R2. README says a required lab "is finished only with proof".** Since item 26 (Q5) a required lab can also be finished as "Moving on, not solved" after all hints or 45 minutes (`README.md:42`). README also never says the lesson videos now play inside the app (fix 20); that is missing, not false.

**R3. SCOPE.md's "Where things stand" for Scope 3 is out of date.** `SCOPE.md:108-110` still says "Waiting on Shad: Q1 to Q10" and that `AUDIT-FULL-PROMPT.md` is held back "until Shad says whether to publish it (question Q4)". Both were answered on 27 Nov.

**R4. Commit 962b99e's message is wrong about Jobs** (finding 1): it says an ad naming only the city is now "check"; it is hidden. A commit cannot be changed; the fix log in `AUDIT-FULL.md` section 8 can say so.

**R5. Fix 22's record says "buttons and folds 44 px or taller".** Measured at 390 and 320 px: Settings' "Clear all ticks" button is 36 px, the lab's chat-file picker 24 px, the rotation date box 40 px, the GitHub username box 40 px (`out\layout.txt`).

**R6. The Jobs screen says the weekly scan reads the boards of "34 AI companies".** `tools/job_feeds.py` has 32 boards (README's 32 is right), and some are contract platforms and two are bug-bounty platforms, not AI companies (`app.js:3920`; `jobs.js` "boards": 34). The number corrects itself at Monday's scan; "AI companies" does not.

### Could be better (only where it costs you time)

**C1. A report or write-up with numbered headings fails the GitHub check with a confusing message.** `## 1. Summary` or `1. Target:` fails tl2 and tl3, and the message lists every part as missing although they are all there (`app.js:2857-2869`, `scripts\gh_checks_test.js`). Headings as the box says (`## Summary`, `**Summary:**`, `Target:` as in the app's template), with capitals, colons or Windows line endings, all pass.

**C2. The fee and chat-app filter (`SCAM`, `tools/find_jobs.py:51`) hides honest titles** such as "Crypto Red Team Lead", "AI Red Teamer - Signal App Security", "Fee-based consultant" and "WhatsApp red team", and misses "Pay $50 to apply" and "Paid in USDC". None of the 2,000-plus titles in tonight's feeds trips it, so nothing is lost today.

**C3. Before you paste the store rules (Q2).** The rules refuse any time stamp more than 7 days ahead. If one value in a save is refused, Firebase refuses the whole save, and the app then says "No internet: saved here, will send later" and retries every 30 seconds for ever (`app.js:1936-1955`). That needs a device whose clock ran more than 7 days fast, now or in the past; phones set their own clocks, so it is unlikely. After pasting: if Settings says "No internet" while the internet works, put your old rules back. Pairing, backup codes and every mark name the app writes fit the rules (the rules' name pattern is the app's own `ID_RE`, `app.js:1668`).

**C4. Box a3's settings line says `OPENAI_CHAT_MODEL=gpt-4o` with no warning**, while box m0 says OpenAI shuts GPT-4o down on 14 Jan 2027. Add a3 to the January re-test (Q1 and Q7 are already on the 5 Jan reminder).

**C5. Box g6 says both "stop after about an hour" and "you are done when you have tried every scenario" of 26.** Step 3 boxes carry no hours, so nothing says how long all 26 take.

**C6. The cache tag was not changed after item 26's three app changes** (`index.html` still loads `v=20261127o`). GitHub Pages lets a browser keep a copy for 10 minutes, so a phone could run the copy from before Q5, Q6 and Q8 for up to 10 minutes after a change. It heals itself.

**C7. The GitHub code check can miss real code in two rare cases**: a `'''` inside a normal string, or a `"""` inside a comment, hides the code after it until the next one (`app.js:2846-2855`, `scripts\gh_checks_test.js`). f-strings with `#`, apostrophes, escaped quotes, docstrings, calls split over lines and Windows line endings all pass.

**C8. Cosmetic, from the videos helper:** c50 lists "CS50P - Introduction" 11th, after Lecture 9; wb6 still says "On Hacker101, watch the newcomer videos" although the app now plays them; Microsoft's own titles "6 Summary" and "5 Summary" sit on units 7 and 8; md7's second video is agents lesson 06's and its title does not say so.

---

## 3. Every fix, with a verdict

1. **B1 `#sync=` asks first: works.** App test checks pass, local and live (487).
2. **B2 "Load this code" asks first: works.** Same.
3. **B3 rotation survives: works.** Same, plus the two-device test on the live site (14 checks, ALL PASSED).
4. **B4 unknown marks kept: works.** Same. The store rules' name pattern matches the app's, so kept marks can still be sent.
5. **A2 lab-proof checker: works as recorded.** `tools/proof_test.js` 109 cases pass; the audit's attack set gives the same 43 wrong of 132, the same 43 ids, as at fix 25 (`scripts\lab-proof\now-output.txt`).
6. **A1 A3 D1 C6 lab text: works.** App test checks pass.
7. **Steps 1 to 6 facts: works.** a1: PyPI says PyRIT 0.9.0 needs Python ">=3.10, <3.14", as the box says. a3: the `.env` place matches PyRIT 0.9.0's own code (it looks beside the installed package, then from the notebook's folder upward), and the three setting names match. b1 and b3: 0DIN's "at least two different testing categories" and Prompt Extraction N/A (58 of 58 models). b4: Anthropic's program page and form (agreement, Console account, organization ID, two answers of at most 100 words, no link field). Not re-checked: p1, t29. a3's GPT-4o line: C4.
8. **A8 HackerOne address: works.** App test; `https://hackerone.com/someone_honest` is accepted.
9. **A9 A10 key check and ap3: works.** App test.
10. **Wording: works.** App test.
11. **Retry asks everything again: works.** App test; in my run a missed course quiz offered "Take all 8 again, in a new order (opens in 2:00)".
12. **Questions rewritten: partly.** All 49 changed or new right answers are right by their sources and no question has two right answers; give-away hints and options remain (finding 5) and the builder cannot see word matching.
13. **GitHub Desktop: partly.** Download, sign-in, Choose..., Clone, Summary, Commit to main and Push origin match GitHub's pages for a repository with a file; but the repository ap1 has you make is empty (finding 2).
14. **GitHub checks: works**, with the rare gaps in C1 and C7. ag4's check read the real garak 0.17.1 report from the audit's run correctly (first line `start_run setup`, `plugins.target_type: huggingface`).
15. **OWASP 2026: partly.** Facts and numbers right against the saved and live 2026 pages; all 8 questions passable by word matching (finding 5).
16. **PortSwigger's 8 labs: works.** ag2 matches the saved and live pages; the 4 scanner labs still say the solution "will be published shortly".
17. **garak and PyRIT from real runs: partly.** Box text matches the real runs; ag4 question 7 contradicts the box (finding 5); ag5 questions 3 to 8 come from PyRIT's main page, which matched 1.2.1's on 27 Nov and has since lost 2 lines (drift risk only).
18. **Steps 7 to 14 box text: works.** lx1's ssh command and password match bandit0.html, and the rules page says "Do not publish credentials"; fc1's settings names, profile rule and AI pledge match freeCodeCamp's code and its published policy. Not re-checked tonight: md, wb4, c50, pd1, pd4, pd5, tl2 and tl3 wording beyond what the app test checks.
19. **Library lessons and words: works.** 92 words, none doubled (app test); README still says 84 (R1).
20. **Lesson videos inside the app: works.** The walk test on the live site played all 68 at phone size; the helper matched all 68 (not a sample) to their real pages: same title, length within half a second, embedding allowed; no box's videos run longer than its time (the biggest share is md2, 23 of 90 minutes). The quiz under a video on screen answers to the end (`scripts\video_quiz_test.py`). There are 19 boxes with videos. Cosmetic points: C8.
21. **Jobs tools: partly.** The Canada cases fix 21 named still pass and the two wrong feeds are gone; but item 26 broke the city (finding 1), "until the position is filled" closes an open ad (finding 3), and the fee filter hides honest titles (C2). The daily check ran and succeeded every day 18 to 27 Nov; the weekly scan ran 19 and 23 Nov, both succeeded. No run has used fix 21's code yet. All 26 ads shown answer 200; the 2 marked closed are really gone (404, 410).
22. **Ease of use: partly.** The cursor never leaves a box while you type (Explain it back, lab note, GitHub box: `scripts\focus_test.py`, page moved 0 px); reduce motion and contrast checks pass. Broken: Enter in the GitHub and link boxes (finding 6), large text (finding 8), four controls under 44 px (R5).
23. **Tests that can fail: works.** All pass tonight; I did not re-break copies of the app.
24. **Records made true: partly.** README's hours (about 450 plus about 156: measured 449.9 and 156.0), 107 and 12 boxes, 32 boards, 36 lessons and 428 questions (64 on the videos) are right; the word count (R1) and the lab rule (R2) are not.
25. **Every test local and live: works.** Re-run tonight with the same results, except the link check now counts 294 links (295 then), 0 dead, the same 5 sites refusing scripts.
26. **Shad's answers:**
    - Q2 store rules: **waiting on you.** `python tools/store_rules_test.py` tonight: 11 ok and 5 FAIL, exactly the 5 kinds of junk the rules are written to stop; the throwaway record was deleted. Read against the app's code, the rules accept everything the app sends (C3 is the one risk).
    - Q4 personal details: **works, but broke Jobs** (finding 1). Tracked files hold only "Shad", "AlbertanCoder" and the live address; no email, home path or personal facts; the city stays in one jobs test line as a test case. `AUDIT-FULL-PROMPT.md` and the after-fixes prompt are kept out of git by `.git/info/exclude`.
    - Q5 Moving on: **partly** (finding 7).
    - Q6 hints and notes: **partly.** The hints of labs 2, 8, 11 and 12 no longer hand over the move before hint 3 (app test); ep5 Q7 and ep10 Q8 are fixed; but the note gives away 2 answers and ep10 Q8's hint names its answer (findings 4 and 5).
    - Q8 g6: **not checked.** Gray Swan's site refused the helper's request (429, "Vercel Security Checkpoint"). The box text reads sensibly; see C5.

---

## 4. What I could not check, and why

- **A real phone.** Everything ran in Chromium at phone size. The on-screen keyboard (does it hide the bottom bar or the box you type in?), VoiceOver and iPhone Safari's text-size menu need your phone.
- **The store rules in force.** They are not pasted. After you paste them, run `python tools/store_rules_test.py` (it must say ALL PASSED) and `python tools/sync_test.py https://albertancoder.github.io/red-team-path/`.
- **Your own record in the store.** Never read, by the rules of this audit, so I cannot say whether any old value in it is stamped more than 7 days ahead (C3).
- **Gray Swan's Training page (g6).** It refuses scripts. Open https://app.grayswan.ai/training yourself and look for: a Chat set, 26 scenarios, a free certificate, and that name.
- **Anthropic's bounty form**: whether it makes you sign in to Google or type an email (the form's questions were checked; its sign-in screen was not).
- **ap1 with an empty repository**: whether GitHub Desktop then says "Publish branch" instead of "Push origin" (not run; finding 2 avoids it anyway).
- **Microsoft's labs, PyRIT and garak runs.** Not re-run: the labs use your paid OpenAI key (January, Q1 and Q7), and the garak run takes 15 minutes and 523 MB.
