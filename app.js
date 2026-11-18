// Red Team Path: one fixed path into AI red teaming, with ticks that save in this browser and can sync between devices.
// On the device everything is stored under one key (STORE_KEY). If saving fails, a warning shows and the app keeps working in memory.
// Syncing is optional: a private code, kept on the device, names one spot in a small online store that holds ticks only.
(function () {
  "use strict";

  // ---------- links ----------
  var URLS = {
    ms: "https://learn.microsoft.com/en-us/security/ai-red-team/training",
    se: "https://securityelites.com/academy/ai-red-teaming-from-zero/",
    gsTraining: "https://app.grayswan.ai/training",
    gsChallenges: "https://app.grayswan.ai/challenges",
    gs: "https://app.grayswan.ai/arena/challenge/",
    fcc: "https://www.freecodecamp.org/learn/python-v9/",
    odin: "https://0din.ai/policy",
    anthropic: "https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program"
  };

  // One lesson page per course day, copied from the course's own index on 17 Nov 2026.
  // learn/check.py loads all 21; if the course renames a page, that check fails.
  var SE_DAYS = [
    "day-1-orientation-first-prompt-injection-win",
    "day-2-how-an-ai-application-is-built",
    "day-3-threat-thinking-owasp-llm-top-10",
    "day-4-direct-prompt-injection-system-prompt-leak",
    "day-5-jailbreaking-roleplay-bypass-lab",
    "day-6-instruction-conflicts-refusal-suppression-labs",
    "day-7-encoding-language-tricks-filter-gaps",
    "day-8-multi-turn-many-shot-jailbreaks",
    "day-9-output-filters-defences-jailbreak-test-plan",
    "day-10-indirect-prompt-injection-document-summariser",
    "day-11-rag-explained-knowledge-base-poisoning",
    "day-12-hidden-text-images-invisible-characters",
    "day-13-attacking-defending-document-pipeline-summariser",
    "day-14-agents-tools-excessive-agency-least-privilege",
    "day-15-hijack-coding-agent-poisoned-issue",
    "day-16-tool-descriptions-rogue-mcp-servers",
    "day-17-memory-poisoning-and-data-exfiltration",
    "day-18-agent-hijack-indirect-tool-call-injection",
    "day-19-unsafe-output-handling-fake-packages",
    "day-20-defence-mapping-owasp-top-10-report-writing",
    "day-21-capstone-assess-an-agent-report"
  ];

  // ---------- the path ----------
  var VIDEOS = [
    "What is AI red teaming?",
    "How generative AI models work",
    "Direct prompt injection explained",
    "Indirect prompt injection explained",
    "Single-turn attacks",
    "Multi-turn attacks",
    "Defending against attacks",
    "Automating AI red teaming with PyRIT",
    "Automating single-turn attacks",
    "Automating multi-turn attacks"
  ];

  // [course day title, why you do it]
  var COURSE = [
    ["Orientation and your first win", "You set up your notes and make a practice chatbot ignore its instructions."],
    ["How an AI application is put together", "You learn the parts of an AI app, so you know where an attack can get in."],
    ["Threat thinking and the OWASP LLM Top 10", "You learn the 10 named weaknesses that job ads and reports refer to."],
    ["Direct prompt injection and system prompt leaks", "You pull a hidden system prompt out of a practice bot."],
    ["Jailbreaking and the roleplay bypass", "You run a role-play jailbreak and learn how it differs from prompt injection."],
    ["Instruction conflicts and refusal suppression", "You test whether a model keeps refusing when its rules conflict."],
    ["Encoding and language tricks", "You use encoded text and another language to find gaps in a filter."],
    ["Multi-turn and many-shot jailbreaks", "You use slow escalation and fake dialogue, the attacks that take several messages."],
    ["Output filters, defences and a jailbreak test plan", "You get past a simple output filter and write a test plan someone else could repeat."],
    ["Indirect prompt injection", "You hide an instruction in a document and watch an AI summariser obey it."],
    ["RAG explained and knowledge base poisoning", "You learn how an AI looks things up in documents, and poison a practice knowledge base."],
    ["Hidden text: images and invisible characters", "You hide instructions in images and in characters people cannot see."],
    ["Attacking and defending a document pipeline", "You beat a document summariser with a crafted file and propose three fixes."],
    ["Agents, tools and excessive agency", "You learn what an AI agent is and judge whether it has too much power."],
    ["Hijacking an agent through a poisoned issue", "You steer a coding agent using hostile text in a ticket."],
    ["Tool descriptions and rogue MCP servers", "You spot hostile instructions hidden in a tool's description."],
    ["Memory poisoning and data exfiltration", "You plant an instruction in an agent's memory and trace how data leaks out."],
    ["Agent hijack: apply and review", "You hijack an agent through its tools, then explain the fix."],
    ["Unsafe output handling and fake packages", "You see how an app that trusts AI output gets attacked."],
    ["Defence, remaining Top 10 items and report writing", "You match a defence to each of the 10 weaknesses and structure a finding."],
    ["Capstone: assess an agent and plan your next steps", "You run a full assessment of a practice agent and write your first report."]
  ];

  // Gray Swan training sets, matched to the course day they follow. [title, challenge slug]
  var LAB = { title: "The Labyrinth, 5 starter scenarios", slug: "onboarding-quest-1" };
  var CHAT = { title: "Introduction to Red Teaming Chatbots, 5 scenarios", slug: "training-beginner-chatbot" };
  var AGENT = { title: "Introduction to Red Teaming Agents, 5 scenarios", slug: "training-beginner-agent" };
  var LAB2 = { title: "The Labyrinth: Challenge Edition, 4 scenarios", slug: "labyrinth-challenge-version" };
  var LUCKY = { title: "Lucky Break: Level Up, 6 scenarios", slug: "lucky-break-level-up" };
  var IPI = { title: "Introduction to Indirect Prompt Injection, 8 scenarios", slug: "training-intermediate-agent" };
  var PG_CHAT = { title: "Proving Ground, the Chat set", slug: "proving-ground" };
  var PG_IND = { title: "Proving Ground, the Indirect set", slug: "proving-ground" };
  var PG_AGENT = { title: "Proving Ground, the Agent set", slug: "proving-ground" };
  var PG_WEAK = { title: "Proving Ground, your weakest set", slug: "proving-ground" };
  var PRACTICE = [LAB, CHAT, AGENT, LAB2, LUCKY, LUCKY, PG_CHAT, PG_CHAT, PG_CHAT, IPI, IPI,
    PG_IND, PG_IND, PG_AGENT, PG_AGENT, PG_AGENT, PG_AGENT, PG_AGENT, PG_WEAK, PG_WEAK, null];
  var WRITEUP_ON = { 3: 1, 6: 2, 9: 3, 14: 4, 21: 5 };

  // freeCodeCamp Python Certification sections: [title, steps]
  var PYTHON = [["Python Basics", 143], ["Loops and Sequences", 31], ["Dictionaries and Sets", 53], ["Error Handling", 7], ["Classes and Objects", 71]];

  var KIND = { video: "VIDEO", course: "COURSE + LAB", practice: "PRACTICE", writeup: "WRITE-UP", code: "PYTHON", bounty: "BOUNTY" };

  function item(id, kind, title, why, url, extra) {
    var it = { id: id, kind: kind, title: title, why: why || "", url: url || "", optional: false };
    if (extra) { Object.keys(extra).forEach(function (k) { it[k] = extra[k]; }); }
    return it;
  }

  function buildSteps() {
    var videos = VIDEOS.map(function (t, i) {
      return item("v" + (i + 1), "video", "Episode " + (i + 1) + ": " + t,
        i >= 7 ? "This one shows an automation tool. Watch it, install nothing." : "", URLS.ms);
    });

    var days = COURSE.map(function (c, i) {
      var d = i + 1;
      var items = [item("c" + d, "course", "Course day " + d + ": " + c[0], c[1], URLS.se + SE_DAYS[i] + "/")];
      var p = PRACTICE[i];
      items.push(p
        ? item("g" + d, "practice", "Gray Swan: " + p.title, "You try on a scored target what today's course day taught. Stop when your time is up, solved or not: unsolved is normal.", URLS.gs + p.slug)
        : item("g" + d, "practice", "Gray Swan: a live prize contest if one is open, or your favourite set", "You finish the course by testing yourself where it counts. Stop when your time is up, solved or not.", URLS.gsChallenges));
      if (WRITEUP_ON[d]) {
        items.push(item("w" + WRITEUP_ON[d], "writeup", d === 21
          ? "Write-up 5: your final project report, if the course allows sharing it"
          : "Write-up " + WRITEUP_ON[d] + ": write down one attack you did, using the write-up template",
          "Write-ups are the proof employers and contest organisers ask to see.", ""));
      }
      return { label: "DAY " + (d < 10 ? "0" + d : d), items: items };
    });

    var python = PYTHON.map(function (s, i) {
      return item("py" + (i + 1), "code", s[0] + ", " + s[1] + " steps",
        i === 0 ? "You learn to read and write simple Python. Skip the short 'Install Python' section: everything runs in the browser." : "", URLS.fcc);
    });
    python.push(item("py6", "code", "Optional: finish the rest, pass the 5 projects and the free exam for the certificate",
      "The certificate is free, but the rest of the course is long. Do it only if you want the certificate.", URLS.fcc, { optional: true }));

    return [
      { title: "Step 1: Microsoft AI Red Teaming 101", short: "VIDEOS",
        goal: "Watch all 10 episodes. Watching them on YouTube is the same series.",
        why: "The basics from Microsoft's own AI red team, and the best-known name to put on a resume.",
        groups: [{ label: "", items: videos }] },
      { title: "Step 2: one course day, then Gray Swan", short: "COURSE + PRACTICE",
        goal: "21 days. The SecurityElites course day first, then Gray Swan's training sets in the order below. Five write-ups along the way.",
        why: "",
        groups: days },
      { title: "Step 3: Python, on freeCodeCamp", short: "PYTHON",
        goal: "Work through the first five sections in order. Keep one Gray Swan session a week so your skills stay sharp.",
        why: "Most AI red-team job ads ask for basic Python scripting.",
        groups: [{ label: "", items: python }] },
      { title: "Step 4: bounties", short: "BOUNTIES",
        goal: "Only real findings that work every time. Never send a guess.",
        why: "A paid or credited finding is the strongest proof there is.",
        groups: [{ label: "", items: [
          item("b1", "bounty", "Read Mozilla 0DIN's rules fully. Note what pays and what does not.", "", URLS.odin),
          item("b2", "bounty", "Test 3 ideas, only inside 0DIN's rules. Save every prompt and result, and keep them private.", "", ""),
          item("b3", "bounty", "Decide honestly whether one is a real, new finding. If yes, send 0DIN the short summary it asks for.", "", URLS.odin),
          item("b4", "bounty", "Apply to Anthropic's model safety bug bounty, using your write-ups and results.", "", URLS.anthropic)
        ] }] }
    ];
  }

  var STEPS = buildSteps();

  // ---------- reference content ----------
  var PLACES = [
    ["Microsoft AI Red Teaming 101", URLS.ms, "VIDEO · STEP 1 · 10 EPISODES",
      "From Microsoft's own AI red team. Episodes 1 to 7 teach the attacks. Episodes 8 to 10 show an automation tool called PyRIT."],
    ["SecurityElites: AI Red Teaming From Zero", URLS.se, "COURSE + LAB · STEP 2 · 21 DAYS · 45 TO 75 MIN A DAY",
      "Written for people with no security background. Each day has a practice lab in the browser, and day 21 ends in a full report. It is new and has no outside reviews yet, so judge it yourself after 3 days. Pay for nothing there."],
    ["Gray Swan Arena", URLS.gsTraining, "PRACTICE · STEP 2 ONWARD · 11 TRAINING SETS",
      "Scored practice against real AI models: 3 beginner sets, 3 intermediate sets and the large Proving Ground sets, open any time. Prize contests come and go on the same site."],
    ["freeCodeCamp: Python Certification", URLS.fcc, "PYTHON · STEP 3 · IN THE BROWSER",
      "Reading and doing, one small step at a time, with nothing to install. The certificate at the end is free."]
  ];
  var MONEY = [
    ["Hourly AI testing and rating platforms", "The quickest money when an application lands. Pay and acceptance vary a lot, and nobody can promise either."],
    ["Gray Swan prize contests", "Prize money goes mostly to top finishers. For a beginner the real payoff is a leaderboard placing you can show."],
    ["Bug bounties", "Mozilla 0DIN pays US$500 to US$15,000 for a new finding that works every time. Anthropic's program pays up to US$35,000, but you apply and they choose who gets in."],
    ["A job", "Entry-level AI red-team jobs exist but are rare. Public write-ups, contest results and basic Python are what a newcomer can show instead of experience."]
  ];
  var RULES = [
    "Only attack sites built for it, or programs that invite it in writing. Never test a company's live product outside its bounty rules.",
    "Weapons topics only inside an official program that asks for that testing. Never anywhere else.",
    "Check a site's sharing rules before posting a write-up. Live contests and bounties often require you to keep details private.",
    "Every write-up is your own real attempt. Never claim something you did not do."
  ];
  var TEMPLATE = "Target: (site and challenge name)\nGoal: (what the AI was not supposed to do)\nWhat I tried: (numbered steps, with the exact prompts)\nWhat happened: (the result, plus a screenshot)\nDoes it repeat: (worked __ of 3 tries)\nHow bad is it: (low, medium or high, and why)\nHow to fix it: (one suggestion)";

  // ---------- words: plain-English meanings. The tag says where the word comes up, and is left empty when no lesson title names it. ----------
  var WORDS = [
    ["The basics", [
      ["AI model (LLM)", "VIDEO 2", "A large language model: software trained on huge amounts of text that writes by predicting the next words. Chatbots are built on these."],
      ["Prompt", "VIDEO 2", "Whatever you type or send to the model."],
      ["AI application", "DAY 2", "A product built around a model: the model plus hidden instructions, data, tools and filters. You attack the whole thing, not just the model."],
      ["System prompt", "DAY 4", "Hidden instructions from the company that built the chatbot, telling the model how to behave. Users are not meant to see it."],
      ["Context window", "", "Everything the model can see at one time: its hidden instructions, the chat so far, and any documents or tool results."],
      ["Guardrail", "VIDEO 7 · DAY 9", "Any safety layer meant to stop bad behaviour: the model's training, its hidden instructions, or filters on what goes in and what comes out."],
      ["Refusal", "DAY 6", "The model saying no. Most attacks are attempts to get past a refusal."],
      ["Hallucination", "", "The model stating something false as if it were true. A reliability problem, not an attack."]
    ]],
    ["Attacks", [
      ["AI red teaming", "VIDEO 1", "Attacking an AI system on purpose, with permission, to find its weak points before real attackers do."],
      ["Jailbreak", "DAY 5", "Getting a model to break its own safety rules, such as producing content it is trained to refuse."],
      ["Prompt injection", "VIDEO 3", "Slipping your own instructions into what the model reads, so it follows you instead of the company that built it."],
      ["Direct prompt injection", "VIDEO 3 · DAY 4", "You type the attack yourself, straight into the chat."],
      ["Indirect prompt injection", "VIDEO 4 · DAY 10", "The attack hides in something the AI reads later: a web page, an email, a document. The victim never types it."],
      ["System prompt leak", "DAY 4", "Tricking a chatbot into revealing its hidden instructions."],
      ["Role-play attack", "DAY 5", "Asking the model to play a character or tell a story in which the forbidden answer seems allowed."],
      ["Refusal suppression", "DAY 6", "Wording a request so the model is steered away from saying no, for example by telling it never to apologise or warn."],
      ["Encoding trick", "DAY 7", "Hiding a request from filters by changing its form: another language, code words, scrambled spelling."],
      ["Single-turn attack", "VIDEO 5", "An attack that fits in one message."],
      ["Multi-turn attack", "VIDEO 6 · DAY 8", "An attack spread over several messages, each step small enough to pass."],
      ["Many-shot jailbreak", "DAY 8", "Packing one prompt with many made-up examples of the model answering forbidden questions, so it carries on the pattern."],
      ["Hidden text", "DAY 12", "Instructions a person cannot see but the AI can: invisible characters, or text tucked inside an image."],
      ["Universal jailbreak", "STEP 4", "One method that works across many different forbidden requests, not just one. Anthropic's bounty asks for these."]
    ]],
    ["Agents", [
      ["Agent", "DAY 14", "An AI that takes actions, not just talks: it can browse, send email or run code by using tools."],
      ["Tool call", "DAY 14", "A tool is something the agent is allowed to use, such as search or send-email. A tool call is the agent using one."],
      ["Excessive agency", "DAY 14", "An agent with more power or access than its job needs, so one trick does real damage. The fix is to give it only what it needs."],
      ["RAG", "DAY 11", "Retrieval-augmented generation: the AI looks things up in a store of documents and uses what it finds to answer."],
      ["Knowledge-base poisoning", "DAY 11", "Planting a doctored document in that store, so the AI later repeats or obeys it."],
      ["Agent hijack", "DAY 15 · DAY 18", "Taking control of what an agent does, usually through text it reads while working."],
      ["MCP", "DAY 16", "Model Context Protocol: a common standard for plugging tools and data into AI agents. A rogue MCP server is a tool source set up to attack the agent."],
      ["Tool poisoning", "DAY 16", "Hiding instructions inside a tool's description, so the agent obeys them."],
      ["Memory poisoning", "DAY 17", "Getting a false instruction saved in an agent's long-term memory, so it keeps acting on it later."],
      ["Data exfiltration", "DAY 17", "Getting the AI to send private data somewhere it should not go."],
      ["Unsafe output handling", "DAY 19", "An app that trusts whatever the AI writes and runs or displays it without checking."]
    ]],
    ["The work", [
      ["Threat model", "DAY 3", "A plain list of who might attack a system, what they want and how they could get it."],
      ["OWASP LLM Top 10", "DAY 3 · DAY 20", "A well-known public list of the ten most serious weaknesses in AI applications. Job ads and reports refer to it."],
      ["Scope", "STEP 4", "What a program allows you to test. Anything outside scope is off limits."],
      ["Reproducible", "STEP 4", "It works again when someone else follows your steps. Bounties pay only for this."],
      ["Attack success rate", "", "How often an attack works, such as 7 of 10 tries. Reports and tools use this number."],
      ["Write-up", "DAY 20", "A short report of one attack: the target, what you tried, what happened, how bad it is and how to fix it."],
      ["Bug bounty", "STEP 4", "A program that pays outsiders for reporting real flaws."],
      ["Responsible disclosure", "", "Reporting a flaw privately to the owner, and giving them time to fix it before saying anything in public."],
      ["PyRIT", "VIDEO 8", "Microsoft's free tool for running many attacks automatically. It needs Python."],
      ["CTF", "", "Capture the flag: a security game you win by reaching a hidden goal. Gray Swan's training sets work this way."]
    ]]
  ];

  // ---------- jobs: the ads themselves live in jobs.js, which the link check (tools/check_jobs.py) rewrites. ----------
  var JOBS = window.RTP_JOBS && Array.isArray(window.RTP_JOBS.ads) ? window.RTP_JOBS : { updated: "", ads: [] };
  var HONEST = [
    "Most work a beginner can get is contract work, paid by the hour through AI-training platforms. It comes project by project, and hours are not guaranteed.",
    "Some ads are talent pools: you apply, pass a test or an AI interview, then wait for a project. A posted rate is not an offer.",
    "Full-time jobs exist, but the engineer-level ads read for this page asked for experience in security, coding or machine learning.",
    "Nobody can promise a job. This path builds proof you can show."
  ];
  // Ready-made searches: these always show today's ads, whatever the list above says.
  var SEARCHES = [
    ["LinkedIn: \"AI red team\", remote", "https://www.linkedin.com/jobs/search/?keywords=%22AI%20red%20team%22&f_WT=2"],
    ["Indeed Canada: \"AI red team\", remote", "https://ca.indeed.com/jobs?q=%22AI+red+team%22&l=Remote"],
    ["Google: AI red teamer jobs, remote", "https://www.google.com/search?q=AI+red+teamer+jobs+remote"]
  ];
  var BOARDS = [
    ["Alignerr", "https://www.alignerr.com/jobs", "Contract AI testing and rating projects."],
    ["Clera", "https://jobs.ashbyhq.com/Clera", "Talent pools for safety testing and evaluation."],
    ["Claru", "https://claru.ai/jobs", "Contract projects. You create a profile, then join projects as they open."],
    ["micro1", "https://www.micro1.ai/experts/opportunities", "Contract projects, usually with an AI interview first."],
    ["Mercor", "https://work.mercor.com/explore", "Contract projects. Ads open and close quickly."],
    ["OpenTrain", "https://www.opentrain.ai/jobs", "A job board for AI training work from many companies."],
    ["aitraining.jobs", "https://aitraining.jobs/roles/red-teaming", "A job board with a red-teaming section."],
    ["Gray Swan challenges", URLS.gsChallenges, "Prize contests, not jobs. A placing counts as proof."]
  ];
  var SEARCH_WORDS = "AI red teamer, LLM red team, adversarial testing, jailbreak, prompt injection, AI safety tester";
  var PROOF = [
    "The Microsoft series and the 21-day course, finished.",
    "A Gray Swan profile with solved sets, and any contest placing.",
    "3 to 5 public write-ups of your own attacks.",
    "Basic Python: the freeCodeCamp sections, or its certificate.",
    "A bounty credit, if you earn one."
  ];
  var APPLY_RULES = [
    "Never pay to apply, for training or for onboarding. Real platforms pay you.",
    "Do ID checks only inside a platform's own official sign-up, never by email or chat.",
    "Answer screening questions truthfully. Most platforms test you, and a made-up claim fails there.",
    "Some ads want trained experts in chemistry, biology or weapons. Skip them unless that is your real field.",
    "If you receive government benefits, find out how gig income must be reported before you accept work."
  ];

  // status: ok = checked, no = not checked, changed = corrected in this audit
  var AUDIT_DATE = "17 Nov 2026";
  var AUDIT = [
    ["ok", "Microsoft's series has 10 episodes; episodes 8 to 10 cover the PyRIT automation tool.", "Read on Microsoft's official training page."],
    ["ok", "The SecurityElites course has 21 days, all live, for beginners, 45 to 75 minutes a day, and asks only for a free account.", "Read on the course page."],
    ["ok", "The course lessons can be read without paying.", "Opened days 2, 3, 10 and 21: each is over 2,900 words with no paywall text."],
    ["no", "Every course lab stays free.", "The day 1 lab page says it is a free lab. The other labs need a sign-in, so they could not be tested. If a day asks for money, stop."],
    ["no", "The course is good.", "Nobody outside has reviewed it. Its pages were updated on 15 and 16 Nov 2026, so it is new, and the author uses a pen name. The lessons read well: clear goals, recall questions and a lab each day."],
    ["ok", "Gray Swan has 11 training sets that are open any time.", "Seen on its Training page in a signed-in free account."],
    ["changed", "An earlier version said Gray Swan posts new challenges every Wednesday.", "Not true now: that series is closed for judging and its sets live on the Training page. The claim was removed."],
    ["changed", "An earlier version said Gray Swan has paid out over US$1 million and brought 100 people into paid work.", "No source was found for those numbers, so they were removed. What is sourced: a US$300,000 contest sponsored by Anthropic, Meta, Google DeepMind and Reflection AI (Fortune, Oct 2026), and Gray Swan's own June 2025 post saying it had paid out over US$370,000 and hired from its players."],
    ["changed", "The Python course was Python for Everybody.", "Changed to freeCodeCamp's Python Certification: it runs fully in the browser, the other starts with installing Python. Its official page shows 584 steps, 5 required projects and an exam."],
    ["ok", "Mozilla 0DIN pays US$500 to US$15,000 and asks for a short summary first.", "Read on 0DIN's policy page."],
    ["ok", "Anthropic's model safety bounty pays up to US$35,000, takes applications, and requires a confidentiality agreement.", "Read on Anthropic's help page."],
    ["ok", "AI red-team job ads ask for Python.", "Several 2026 postings ask for Python or basic scripting. This is a sample of ads, not a survey."],
    ["changed", "The Python sample above used to count an entry-level salaried ad.", "That ad (10a Labs) was not on the company's own job board on 17 Nov 2026, so it now counts as closed. No other entry-level salaried ad was found."],
    ["ok", "Every link in the app opens the right page.", "Opened on 17 Nov 2026: all 21 lesson pages, 9 Gray Swan pages, the Microsoft, freeCodeCamp, 0DIN and Anthropic pages, the job sites and the job searches."],
    ["ok", "The job titles, pay and asks on the Jobs tab come from real ads.", "Each ad was read on its own page on 17 Nov 2026. Pay is copied as the ad posted it. Ads close and pay changes, so they are examples, not offers."],
    ["ok", "An ad on the Jobs tab has a working link.", "A link check opens every ad's page. If the page is gone, leads somewhere else or says it is closed, the ad is hidden. Each ad shows the date its link was last checked."],
    ["no", "A listed ad still has work to give.", "The link check only proves an ad is still posted. A talent pool can stay posted while no project is running."],
    ["no", "A posted hourly rate is what you would earn.", "A range in an ad is not an offer, and contract platforms do not guarantee hours."],
    ["no", "The Words tab is an official glossary.", "The meanings are plain-English summaries written for this app and matched to lesson titles. The courses are the authority."],
    ["ok", "Syncing stores ticks and streak days only, and a sync link reaches only its own ticks.", "Tested on 17 Nov 2026: reading the whole store, listing other people's links, and saving anything except numbers were all refused."],
    ["no", "Finishing this path gets you hired.", "Nobody can promise that. The path builds the things a newcomer can show: write-ups, contest results, a known course and basic Python."]
  ];

  // ---------- saving on this device ----------
  // m: box id -> the time it was ticked (positive) or unticked (negative). The newest time wins when two devices disagree.
  // y: day -> time, for the streak. r: time of the last "clear all ticks". sync: this device's private sync code, or "".
  var STORE_KEY = "redTeamPath.v2";
  var SYNC_RE = /^[a-z2-9]{32}$/;
  var DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  var state = { m: {}, y: {}, r: 0, best: 0, theme: "dark", open: {}, test: false, sync: "" };
  var KNOWN = {};
  var SEQ = []; // every box that counts, in path order
  STEPS.forEach(function (step, s) {
    step.groups.forEach(function (group) {
      group.items.forEach(function (it) {
        KNOWN[it.id] = it;
        if (!it.optional) { SEQ.push({ it: it, s: s, label: group.label }); }
      });
    });
  });

  function storageFailed() {
    var w = document.getElementById("storage-warning");
    if (w) { w.hidden = false; }
  }
  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) { adopt(JSON.parse(raw)); }
      window.localStorage.setItem(STORE_KEY + ".test", "1");
      window.localStorage.removeItem(STORE_KEY + ".test");
    } catch (e) { storageFailed(); }
  }
  function adopt(p) {
    if (!p || typeof p !== "object") { return; }
    var now = Date.now();
    if (p.m && typeof p.m === "object") {
      Object.keys(p.m).forEach(function (id) { if (KNOWN[id] && typeof p.m[id] === "number") { state.m[id] = p.m[id]; } });
    } else if (p.done && typeof p.done === "object") {
      // Saved by an earlier version of the app, which kept ticks without times.
      Object.keys(p.done).forEach(function (id) { if (KNOWN[id]) { state.m[id] = now; } });
    }
    if (p.y && typeof p.y === "object") {
      Object.keys(p.y).forEach(function (k) { if (DAY_RE.test(k) && typeof p.y[k] === "number") { state.y[k] = p.y[k]; } });
    } else if (p.days && typeof p.days === "object") {
      Object.keys(p.days).forEach(function (k) { if (DAY_RE.test(k)) { state.y[k] = now; } });
    }
    if (typeof p.r === "number") { state.r = p.r; }
    if (typeof p.best === "number") { state.best = p.best; }
    if (p.theme === "light" || p.theme === "dark") { state.theme = p.theme; }
    if (p.open && typeof p.open === "object") { state.open = p.open; }
    if (p.test === true) { state.test = true; }
    if (typeof p.sync === "string" && SYNC_RE.test(p.sync)) { state.sync = p.sync; }
  }
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { storageFailed(); }
  }

  // ---------- helpers ----------
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") { n.textContent = attrs[k]; }
        else if (k === "class") { n.className = attrs[k]; }
        else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) { n.setAttribute(k, attrs[k]); }
      });
    }
    (kids || []).forEach(function (k) { if (k) { n.appendChild(typeof k === "string" ? document.createTextNode(k) : k); } });
    return n;
  }
  function link(text, url, cls) {
    return h("a", { href: url, target: "_blank", rel: "noopener", class: cls || "", text: text });
  }
  function bullets(items) {
    var ul = h("ul", { class: "plain" });
    items.forEach(function (x) { ul.appendChild(h("li", { text: x })); });
    return ul;
  }
  function copyText(text, status, node) {
    // Copies to the clipboard; if the browser refuses, selects the text so it can be copied by hand.
    function byHand() {
      if (node.select) { node.focus(); node.select(); }
      else {
        var range = document.createRange();
        range.selectNodeContents(node);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      status.textContent = "Selected. Copy it from here.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status.textContent = "Copied."; }, byHand);
    } else { byHand(); }
  }
  function isDone(id) { return state.m[id] > 0; }
  function stepItems(step) {
    var all = [];
    step.groups.forEach(function (g) { g.items.forEach(function (it) { all.push(it); }); });
    return all;
  }
  function required(items) { return items.filter(function (it) { return !it.optional; }); }
  function doneCount(items) { return items.filter(function (it) { return isDone(it.id); }).length; }
  // Where you are: the first box in path order that is not ticked. Returns its place in SEQ, or -1 when all are ticked.
  function currentIndex() {
    for (var i = 0; i < SEQ.length; i += 1) { if (!isDone(SEQ[i].it.id)) { return i; } }
    return -1;
  }
  function dayKey(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function streak() {
    var d = new Date();
    if (!state.y[dayKey(d)]) { d.setDate(d.getDate() - 1); } // today not ticked yet: the run still counts through yesterday
    var n = 0;
    while (state.y[dayKey(d)]) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  }
  function setDone(it, on) {
    var now = Math.max(Date.now(), state.r + 1); // always newer than the last "clear all"
    var change = {};
    state.m[it.id] = on ? now : -now;
    change["m/" + it.id] = state.m[it.id];
    if (on) {
      var k = dayKey(new Date());
      if (!state.y[k]) { state.y[k] = now; change["y/" + k] = now; }
      var run = streak();
      if (run > state.best) { state.best = run; change.b = run; }
    }
    save();
    push(change);
  }
  function clearAll() {
    state.m = {};
    state.y = {};
    state.best = 0;
    state.open = {};
    state.r = Date.now();
    save();
    if (state.sync) { sync.replace = true; sync.pending = {}; flushSoon(); }
  }

  // ---------- syncing between devices ----------
  // Each person has one private code. The ticks for that code live at DB + code, and every device holding the code reads and
  // writes the same spot. Only ticks, streak days and two numbers are stored there: nothing that says who you are.
  var DB = "https://red-team-path-default-rtdb.firebaseio.com/sync/";
  var sync = { status: "off", pending: {}, replace: false, busy: false, timer: 0, pullTimer: 0, stream: null };
  var STATUS_TEXT = {
    off: "Syncing is off. Ticks are saved on this device only.",
    saving: "Syncing is on. Saving…",
    ok: "Syncing is on. Everything is saved.",
    offline: "Syncing is on, but the internet can't be reached right now. Ticks are safe on this device and will be sent when it is back."
  };

  function newCode() {
    var abc = "abcdefghijkmnpqrstuvwxyz23456789";
    var bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    var out = "";
    for (var i = 0; i < bytes.length; i += 1) { out += abc.charAt(bytes[i] % 32); }
    return out;
  }
  function findCode(text) {
    var m = /(?:^|[^a-z0-9])([a-z2-9]{32})(?![a-z0-9])/.exec(String(text || "").trim());
    return m ? m[1] : "";
  }
  function syncLink() {
    return window.location.href.split("#")[0] + "#sync=" + state.sync;
  }
  function setStatus(s) {
    sync.status = s;
    var line = document.getElementById("sync-status");
    if (line) { line.textContent = STATUS_TEXT[s]; }
    var btn = document.getElementById("menu-btn");
    if (btn) {
      btn.setAttribute("data-sync", s);
      btn.setAttribute("aria-label", "Menu: syncing, settings and info. " + STATUS_TEXT[s]);
    }
  }
  function request(method, body) {
    var opts = { method: method };
    if (body !== undefined) { opts.body = JSON.stringify(body); }
    return window.fetch(DB + state.sync + ".json", opts).then(function (res) {
      if (!res.ok) { throw new Error("sync " + res.status); }
      return res.json();
    });
  }
  function push(change) {
    if (!state.sync) { return; }
    Object.keys(change).forEach(function (k) { sync.pending[k] = change[k]; });
    flushSoon();
  }
  function flushSoon() {
    setStatus("saving");
    window.clearTimeout(sync.timer);
    sync.timer = window.setTimeout(flush, 400);
  }
  function flush() {
    if (!state.sync || sync.busy) { return; }
    var replace = sync.replace;
    var body = sync.pending;
    if (!replace && !Object.keys(body).length) { setStatus("ok"); return; }
    sync.pending = {};
    sync.replace = false;
    sync.busy = true;
    var sent = replace
      ? request("PUT", { m: state.m, y: state.y, r: state.r, b: state.best })
      : request("PATCH", body);
    sent.then(function () {
      sync.busy = false;
      if (sync.replace || Object.keys(sync.pending).length) { flush(); } else { setStatus("ok"); }
    }, function () {
      sync.busy = false;
      if (replace) { sync.replace = true; }
      else { Object.keys(body).forEach(function (k) { if (!(k in sync.pending)) { sync.pending[k] = body[k]; } }); }
      setStatus("offline");
    });
  }
  // Folds what the other devices saved into this device. Returns what this device has that the others lack.
  function mergeRemote(remote) {
    var changed = false;
    var rr = typeof remote.r === "number" ? remote.r : 0;
    if (rr > state.r) {
      // Another device cleared all ticks after this device last heard from it.
      Object.keys(state.m).forEach(function (id) { if (Math.abs(state.m[id]) <= rr) { delete state.m[id]; } });
      Object.keys(state.y).forEach(function (k) { if (state.y[k] <= rr) { delete state.y[k]; } });
      state.best = 0;
      state.r = rr;
      changed = true;
    }
    if (rr < state.r) { return { replace: true, changed: changed, change: {} }; } // this device cleared more recently
    var rm = remote.m && typeof remote.m === "object" ? remote.m : {};
    var ry = remote.y && typeof remote.y === "object" ? remote.y : {};
    var change = {};
    Object.keys(rm).forEach(function (id) {
      var ts = rm[id];
      if (!KNOWN[id] || typeof ts !== "number" || Math.abs(ts) <= state.r) { return; }
      if (Math.abs(ts) > Math.abs(state.m[id] || 0)) { state.m[id] = ts; changed = true; }
    });
    Object.keys(ry).forEach(function (k) {
      var ts = ry[k];
      if (!DAY_RE.test(k) || typeof ts !== "number" || ts <= state.r) { return; }
      if (!state.y[k] || ts < state.y[k]) { state.y[k] = ts; changed = true; }
    });
    if (typeof remote.b === "number" && remote.b > state.best) { state.best = remote.b; changed = true; }
    Object.keys(state.m).forEach(function (id) { if (rm[id] !== state.m[id]) { change["m/" + id] = state.m[id]; } });
    Object.keys(state.y).forEach(function (k) { if (ry[k] !== state.y[k]) { change["y/" + k] = state.y[k]; } });
    if ((typeof remote.b === "number" ? remote.b : 0) < state.best) { change.b = state.best; }
    return { replace: false, changed: changed, change: change };
  }
  function pull() {
    if (!state.sync) { return; }
    var code = state.sync;
    request("GET").then(function (remote) {
      if (state.sync !== code) { return; }
      var out = mergeRemote(remote && typeof remote === "object" ? remote : {});
      save();
      if (out.replace) { sync.replace = true; sync.pending = {}; }
      else { Object.keys(out.change).forEach(function (k) { if (!(k in sync.pending)) { sync.pending[k] = out.change[k]; } }); }
      if (sync.replace || Object.keys(sync.pending).length) { flush(); } else if (!sync.busy) { setStatus("ok"); }
      if (out.changed) { render(); }
    }, function () { setStatus("offline"); });
  }
  function pullSoon() {
    window.clearTimeout(sync.pullTimer);
    sync.pullTimer = window.setTimeout(pull, 250);
  }
  function stopListening() {
    if (sync.stream) { sync.stream.close(); sync.stream = null; }
  }
  function listen() {
    // A live line to the storage: when another device saves a tick, this one hears about it within a second or two.
    stopListening();
    if (!state.sync || !window.EventSource) { return; }
    try {
      sync.stream = new window.EventSource(DB + state.sync + ".json");
      sync.stream.addEventListener("put", pullSoon);
      sync.stream.addEventListener("patch", pullSoon);
    } catch (e) { sync.stream = null; }
  }
  function startSync(code) {
    state.sync = code;
    sync.pending = {};
    sync.replace = false;
    save();
    setStatus("saving");
    pull();
    listen();
  }
  function stopSync() {
    state.sync = "";
    sync.pending = {};
    sync.replace = false;
    save();
    stopListening();
    setStatus("off");
  }
  function wake() {
    // Phones put pages to sleep. When the app comes back, reconnect and fetch what changed.
    if (!state.sync || document.visibilityState === "hidden") { return; }
    if (!sync.stream || sync.stream.readyState === 2) { listen(); }
    pull();
  }

  // ---------- words that belong to a lesson ----------
  // A word is "new" at the first lesson its tag names: VIDEO 3 -> box v3, DAY 4 -> box c4, STEP 4 -> box b1.
  var WORDS_AT = {};
  WORDS.forEach(function (g) {
    g[1].forEach(function (w) {
      var m = /^(VIDEO|DAY|STEP) (\d+)/.exec(w[1]);
      if (!m) { return; }
      var id = m[1] === "VIDEO" ? "v" + m[2] : m[1] === "DAY" ? "c" + m[2] : "b1";
      (WORDS_AT[id] = WORDS_AT[id] || []).push(w);
    });
  });

  // ---------- Now tab: one thing at a time ----------
  var OPEN_LABEL = { video: "Open the video", course: "Open the lesson", practice: "Open the practice", code: "Open the course", bounty: "Open the page" };
  var lastDone = null; // the box ticked most recently on this screen, so one tap can undo it
  var tickedAt = 0;    // a fast double tap must not tick two boxes

  function tagFor(entry) {
    var it = entry.it;
    var parts = [];
    if (entry.label) { parts.push(entry.label); }
    parts.push(KIND[it.kind]);
    if (it.kind === "course") { parts.push("45 TO 75 MIN"); }
    if (it.kind === "writeup") { parts.push("ABOUT 20 MIN"); }
    return parts.join(" · ");
  }
  function templateFold() {
    var status = h("span", { class: "status-line", role: "status" });
    var pre = h("pre", { class: "template", text: TEMPLATE });
    var copy = h("button", { type: "button", text: "Copy template" });
    copy.addEventListener("click", function () { copyText(TEMPLATE, status, pre); });
    return h("details", { class: "fold" }, [h("summary", { text: "Show the write-up template" }), pre, h("div", { class: "btnrow" }, [copy, status])]);
  }
  function wordsFold(words) {
    var list = h("div", { class: "rows" });
    words.forEach(function (w) {
      list.appendChild(h("div", { class: "row" }, [h("div", null, [h("strong", { text: w[0] })]), h("p", { text: w[2] })]));
    });
    return h("details", { class: "fold", id: "new-words" }, [h("summary", { text: "New words in this lesson: " + words.length }), list]);
  }

  function renderNow(idx) {
    var v = document.getElementById("view-now");
    v.textContent = "";
    var undo = null;
    if (lastDone && isDone(lastDone.id)) {
      var undoBtn = h("button", { type: "button", class: "ghost", id: "undo-btn", text: "UNDO" });
      undoBtn.addEventListener("click", function () {
        var it = lastDone;
        lastDone = null;
        setDone(it, false);
        render("done-btn");
      });
      undo = h("p", { class: "ticked", role: "status" }, [h("span", { text: "Ticked: " + lastDone.title }), undoBtn]);
    }
    if (idx === -1) {
      v.appendChild(h("div", { class: "block" }, [
        h("div", { class: "eyebrow", text: "> PATH COMPLETE" }),
        h("h1", { text: "Every box is ticked" }),
        h("p", { class: "lede", text: "Keep entering Gray Swan contests and keep writing up what you find. The Jobs tab shows where to apply." }),
        undo
      ]));
      return;
    }
    var entry = SEQ[idx];
    var it = entry.it;
    var step = STEPS[entry.s];
    var stepStart = idx === 0 || SEQ[idx - 1].s !== entry.s;
    var words = WORDS_AT[it.id];
    var why = it.why || (stepStart ? step.why : "");

    var doneBtn = h("button", { type: "button", class: "big primary", id: "done-btn", text: "I'm done ✓" });
    if (Date.now() - tickedAt < 700) {
      doneBtn.disabled = true;
      window.setTimeout(function () { doneBtn.disabled = false; }, 700);
    }
    doneBtn.addEventListener("click", function () {
      tickedAt = Date.now();
      lastDone = it;
      setDone(it, true);
      render("now-title");
    });

    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> " + step.title.toUpperCase() }),
      h("h1", { id: "now-title", tabindex: "-1", text: "Do this now" }),
      idx === 0 ? h("p", { class: "lede", text: "One fixed path: 4 steps, " + SEQ.length + " boxes, all free. Open the card below, do it, then tap I'm done. The next one appears." }) : null,
      stepStart && idx !== 0 ? h("p", { class: "lede", text: step.goal }) : null
    ]));
    v.appendChild(h("div", { class: "card now", id: "now-card", "data-id": it.id }, [
      h("div", { class: "tag", text: tagFor(entry) }),
      h("div", { class: "title", text: it.title }),
      why ? h("div", { class: "why" }, [h("b", { text: "WHY " }), why]) : null,
      words ? wordsFold(words) : null,
      it.kind === "writeup" ? templateFold() : null,
      it.url ? link(OPEN_LABEL[it.kind] + " ↗", it.url, "big open") : null,
      doneBtn
    ]));
    var after = idx + 1 < SEQ.length ? SEQ[idx + 1].it.title : "that was the last box.";
    v.appendChild(h("div", { class: "block" }, [
      h("p", { class: "after", id: "after-line" }, [h("b", { text: "AFTER THIS " }), after]),
      undo
    ]));
  }

  // ---------- Path tab: the whole list ----------
  function renderPath(idx) {
    var v = document.getElementById("view-path");
    v.textContent = "";
    var here = idx === -1 ? null : SEQ[idx];
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> PATH" }),
      h("h1", { text: "Four steps, top to bottom" }),
      h("p", { class: "lede", text: "The whole list. Days are not tied to dates. Tick or untick any box here." })
    ]));
    STEPS.forEach(function (step, s) {
      var req = required(stepItems(step));
      var n = doneCount(req);
      var det = h("details", { class: "step" + (n === req.length ? " complete" : ""), id: "step-" + (s + 1) });
      det.open = state.open[s] !== undefined ? !!state.open[s] : !!(here && here.s === s);
      det.addEventListener("toggle", function () { state.open[s] = det.open ? 1 : 0; save(); });
      det.appendChild(h("summary", null, [
        h("span", { class: "stitle", text: step.title }),
        h("span", { class: "scount", text: n + "/" + req.length }),
        h("span", { class: "sgoal", text: step.goal })
      ]));
      var body = h("div", { class: "sbody" });
      step.groups.forEach(function (group) {
        var grp = h("div", { class: "grp" });
        if (group.label) { grp.appendChild(h("div", { class: "glabel", text: group.label })); }
        group.items.forEach(function (it) {
          var id = "path-" + it.id;
          var isHere = !!(here && here.it.id === it.id);
          var box = h("input", { type: "checkbox", id: id });
          box.checked = isDone(it.id);
          box.addEventListener("change", function () {
            if (!box.checked && lastDone && lastDone.id === it.id) { lastDone = null; }
            setDone(it, box.checked);
            render(id);
          });
          grp.appendChild(h("div", { class: "line" + (isDone(it.id) ? " done" : "") + (isHere ? " here" : "") }, [
            box,
            h("label", { for: id }, [
              isHere ? h("span", { class: "k you", text: "YOU ARE HERE" }) : null,
              h("span", { class: "k", text: KIND[it.kind] }),
              it.title
            ]),
            it.url ? h("a", { href: it.url, target: "_blank", rel: "noopener", class: "go", "aria-label": "Open: " + it.title, text: "↗" }) : null
          ]));
        });
        body.appendChild(grp);
      });
      det.appendChild(body);
      v.appendChild(det);
    });
  }

  // ---------- Words tab ----------
  function renderWords() {
    var v = document.getElementById("view-words");
    v.textContent = "";
    var total = 0;
    WORDS.forEach(function (g) { total += g[1].length; });
    var toggle = h("button", { type: "button", id: "test-btn", "aria-pressed": state.test ? "true" : "false", text: state.test ? "Test me: ON" : "Test me: OFF" });
    toggle.addEventListener("click", function () {
      state.test = !state.test;
      save();
      renderWords();
      document.getElementById("test-btn").focus({ preventScroll: true });
    });
    var search = h("input", { type: "search", id: "word-search", placeholder: "Search the words", "aria-label": "Search the words", autocomplete: "off" });
    var none = h("p", { class: "lede", id: "word-none", hidden: "", text: "No word matches. Try fewer letters." });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> WORDS · " + total }),
      h("h1", { text: "The words you will hear" }),
      h("p", { class: "lede", text: "Plain-English meanings. The tag shows the video or course day where the word comes up." }),
      search,
      h("div", { class: "btnrow" }, [toggle, h("span", { class: "status-line", role: "status",
        text: state.test ? "Say the meaning in your head, then tap the word to check." : "Turn this on to hide the meanings and check yourself." })]),
      none
    ]));
    var groups = [];
    WORDS.forEach(function (g) {
      var list = h("div", { class: "rows" });
      var rows = [];
      g[1].forEach(function (w) {
        var det = h("details", { class: "word" });
        det.open = !state.test;
        det.appendChild(h("summary", null, [h("span", { class: "term", text: w[0] }), w[1] ? h("span", { class: "where", text: w[1] }) : null]));
        det.appendChild(h("p", { text: w[2] }));
        list.appendChild(det);
        rows.push({ node: det, text: (w[0] + " " + w[2]).toLowerCase() });
      });
      var block = h("div", { class: "block" }, [h("h2", { text: g[0] }), list]);
      v.appendChild(block);
      groups.push({ node: block, rows: rows });
    });
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      groups.forEach(function (g) {
        var any = false;
        g.rows.forEach(function (r) {
          var hit = !q || r.text.indexOf(q) !== -1;
          r.node.hidden = !hit;
          if (hit) { any = true; shown += 1; }
        });
        g.node.hidden = !any;
      });
      none.hidden = shown !== 0;
    });
  }

  // ---------- Jobs tab ----------
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? Number(m[3]) + " " + MONTHS[Number(m[2]) - 1] + " " + m[1] : "";
  }
  function daysSince(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) { return 999; }
    return Math.floor((Date.now() - new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime()) / 86400000);
  }
  function adCard(ad) {
    var stale = daysSince(ad.checked) > 10;
    return h("div", { class: "card ad", "data-id": ad.id }, [
      h("div", { class: "tag", text: ad.who }),
      h("div", { class: "title", text: ad.title }),
      h("div", { class: "pay", text: ad.pay }),
      h("p", { text: ad.ask }),
      h("div", { class: "acts" }, [
        link("Open the ad ↗", ad.url, "open"),
        h("span", { class: "checked" + (stale ? " stale" : ""), text: (stale ? "Not re-checked since " : "Link checked ") + niceDate(ad.checked) })
      ])
    ]);
  }
  function renderJobs() {
    var v = document.getElementById("view-jobs");
    v.textContent = "";
    var open = JOBS.ads.filter(function (a) { return a.open !== false && /^https:\/\//.test(a.url || ""); });
    var start = open.filter(function (a) { return a.level === "start"; });
    var later = open.filter(function (a) { return a.level !== "start"; });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> JOBS" + (JOBS.updated ? " · LINKS CHECKED " + niceDate(JOBS.updated).toUpperCase() : "") }),
      h("h1", { text: "Where this can lead" }),
      h("p", { class: "lede", text: "Real ads with real links. Pay is copied as each ad posted it: an example, not a promise. Each ad shows when its link was last checked, and is hidden once the link dies." })
    ]));

    var startBlock = h("div", { class: "block", id: "jobs-start" }, [
      h("h2", { text: "Open now for beginners" }),
      h("p", { class: "lede", text: "You can apply to these during step 2. Write-ups and Gray Swan results raise your odds." })
    ]);
    if (start.length) { start.forEach(function (a) { startBlock.appendChild(adCard(a)); }); }
    else { startBlock.appendChild(h("p", { class: "note", text: "No beginner ad is confirmed open today. Use the searches below: they always show today's ads." })); }
    v.appendChild(startBlock);

    var searches = h("div", { class: "block", id: "jobs-search" }, [
      h("h2", { text: "Search for today's ads" }),
      h("p", { class: "lede", text: "One tap opens a ready-made search. Other words that work: " + SEARCH_WORDS + "." })
    ]);
    SEARCHES.forEach(function (s) { searches.appendChild(link(s[0] + " ↗", s[1], "big open")); });
    var boards = h("div", { class: "rows" });
    BOARDS.forEach(function (b) {
      boards.appendChild(h("div", { class: "row" }, [h("div", null, [link(b[0], b[1])]), h("p", { text: b[2] })]));
    });
    searches.appendChild(h("details", { class: "fold", id: "jobs-boards" }, [h("summary", { text: "Job boards to check yourself: " + BOARDS.length }), boards]));
    v.appendChild(searches);

    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "The honest picture" }), bullets(HONEST)]));
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "Before you apply anywhere" }), bullets(APPLY_RULES)]));

    var laterFold = h("details", { class: "fold", id: "jobs-later" }, [
      h("summary", { text: "Later goals: ads that ask for experience (" + later.length + ")" }),
      h("p", { class: "dim", text: "What the next rung is called, and what it asks for. Worth applying once you have Python, public write-ups, and a contest placing or bounty credit." })
    ]);
    later.forEach(function (a) { laterFold.appendChild(adCard(a)); });
    var money = h("div", { class: "rows" });
    MONEY.forEach(function (m) {
      money.appendChild(h("div", { class: "row" }, [h("div", null, [h("strong", { text: m[0] })]), h("p", { text: m[1] })]));
    });
    v.appendChild(h("div", { class: "block" }, [
      h("h2", { text: "More" }),
      laterFold,
      h("details", { class: "fold" }, [h("summary", { text: "What to show instead of a degree" }), bullets(PROOF)]),
      h("details", { class: "fold" }, [h("summary", { text: "Four ways this can pay, easiest first" }), money])
    ]));
  }

  // ---------- Menu: syncing, settings, and the reasons behind the path ----------
  function syncPanel() {
    var box = document.getElementById("menu-sync");
    box.textContent = "";
    box.appendChild(h("h2", { text: "Sync my devices" }));
    box.appendChild(h("p", { class: "status-line", id: "sync-status", role: "status", text: STATUS_TEXT[sync.status] }));

    var joinStatus = h("span", { class: "status-line", role: "status", id: "join-status" });
    var joinBox = h("input", { type: "text", id: "join-box", "aria-label": "Sync link from another device", placeholder: "Paste a sync link here", autocomplete: "off", autocapitalize: "off", spellcheck: "false" });
    var joinBtn = h("button", { type: "button", id: "join-btn", text: "Use this link" });
    joinBtn.addEventListener("click", function () {
      var code = findCode(joinBox.value);
      if (!code) { joinStatus.textContent = "That is not a sync link. Copy the whole link and try again."; return; }
      startSync(code);
      syncPanel();
    });

    if (!state.sync) {
      var onBtn = h("button", { type: "button", class: "primary", id: "sync-on", text: "Turn on syncing" });
      onBtn.addEventListener("click", function () {
        startSync(newCode());
        syncPanel();
      });
      box.appendChild(h("p", { text: "Turn this on to see the same ticks on your phone, your computer and any other device, and to keep a safe copy if this browser is ever cleared. No account and no password." }));
      box.appendChild(h("div", { class: "btnrow" }, [onBtn]));
      box.appendChild(h("p", { class: "dim", text: "Already turned it on somewhere else? Paste that device's sync link:" }));
      box.appendChild(joinBox);
      box.appendChild(h("div", { class: "btnrow" }, [joinBtn, joinStatus]));
      return;
    }

    var linkStatus = h("span", { class: "status-line", role: "status", id: "link-status" });
    var linkBox = h("input", { type: "text", id: "sync-link", readonly: "", "aria-label": "Your private sync link", value: syncLink() });
    linkBox.value = syncLink();
    var copyBtn = h("button", { type: "button", class: "primary", id: "sync-copy", text: "Copy my sync link" });
    copyBtn.addEventListener("click", function () { copyText(syncLink(), linkStatus, linkBox); });
    var shareBtn = null;
    if (navigator.share) {
      shareBtn = h("button", { type: "button", id: "sync-share", text: "Send it to myself" });
      shareBtn.addEventListener("click", function () {
        navigator.share({ title: "Red Team Path sync link", url: syncLink() }).catch(function () {});
      });
    }
    var offAsk = h("button", { type: "button", class: "ghost", id: "sync-off", text: "STOP SYNCING ON THIS DEVICE" });
    offAsk.addEventListener("click", function () { stopSync(); syncPanel(); });

    box.appendChild(h("p", { text: "To add a device: open this link on it once. On an iPhone home-screen app, paste the link into this same box there instead (the home-screen app and Safari keep separate ticks)." }));
    box.appendChild(linkBox);
    box.appendChild(h("div", { class: "btnrow" }, [copyBtn, shareBtn, linkStatus]));
    box.appendChild(h("p", { class: "note", text: "Keep this link to yourself. Anyone who has it can see and change your ticks. It stores ticks only: no name, no email, nothing about you." }));
    box.appendChild(h("details", { class: "fold" }, [
      h("summary", { text: "Use a link from another device instead" }),
      h("p", { class: "dim", text: "This device joins that link, and the ticks from both are combined." }),
      joinBox,
      h("div", { class: "btnrow" }, [joinBtn, joinStatus])
    ]));
    box.appendChild(h("div", { class: "btnrow" }, [offAsk]));
  }

  function settingsPanel() {
    var box = document.getElementById("menu-settings");
    var oldFold = box.querySelector("details");
    var foldOpen = !!(oldFold && oldFold.open);
    var oldArea = document.getElementById("backup-code");
    var typed = oldArea ? oldArea.value : "";
    box.textContent = "";
    var themeBtn = h("button", { type: "button", id: "theme-btn", text: state.theme === "dark" ? "Switch to light" : "Switch to dark" });
    themeBtn.addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      save();
      render("theme-btn");
    });
    var run = streak();

    var status = h("span", { class: "status-line", role: "status", id: "backup-status" });
    var area = h("textarea", { id: "backup-code", "aria-label": "Progress code", placeholder: "Paste a progress code here, then press Load this code." });
    area.value = typed;
    var copyBtn = h("button", { type: "button", id: "backup-copy", text: "Copy my progress" });
    copyBtn.addEventListener("click", function () {
      area.value = makeCode();
      copyText(area.value, status, area);
    });
    var loadBtn = h("button", { type: "button", id: "backup-load", text: "Load this code" });
    loadBtn.addEventListener("click", function () {
      if (readCode(area.value)) { render(); document.getElementById("backup-status").textContent = "Loaded. Your ticks are back."; }
      else { status.textContent = "That code did not work. Copy the whole code and try again."; }
    });

    var clearAsk = h("button", { type: "button", class: "ghost", id: "clear-ask", text: "CLEAR ALL TICKS" });
    var clearYes = h("button", { type: "button", id: "clear-yes", text: "Yes, clear them" });
    var clearNo = h("button", { type: "button", id: "clear-no", text: "Keep them" });
    var confirmRow = h("span", { class: "btnrow", hidden: "" }, [
      h("span", { class: "status-line", text: state.sync ? "Clear every tick and the streak, on every synced device?" : "Clear every tick and the streak?" }), clearYes, clearNo]);
    clearAsk.addEventListener("click", function () { confirmRow.hidden = false; clearAsk.hidden = true; });
    clearNo.addEventListener("click", function () { confirmRow.hidden = true; clearAsk.hidden = false; });
    clearYes.addEventListener("click", function () { lastDone = null; clearAll(); render(); });

    box.appendChild(h("h2", { text: "Settings" }));
    box.appendChild(h("div", { class: "btnrow" }, [themeBtn]));
    box.appendChild(h("p", { id: "streak-line", text: "Streak: " + run + (run === 1 ? " day" : " days") + " in a row with at least one box ticked. Best run: " + state.best + "." }));
    box.appendChild(h("details", { class: "fold", id: "backup-fold", open: foldOpen ? "" : null }, [
      h("summary", { text: "Backup code (works without syncing)" }),
      h("p", { class: "dim", text: "A code that holds your ticks. Copy it here and load it in this app on another device, or keep it somewhere safe." }),
      h("div", { class: "btnrow" }, [copyBtn, loadBtn, status]),
      area
    ]));
    box.appendChild(h("div", { class: "btnrow" }, [clearAsk, confirmRow]));
  }
  function makeCode() {
    var done = Object.keys(state.m).filter(isDone);
    return "RTP1." + window.btoa(JSON.stringify({ d: done, y: Object.keys(state.y), b: state.best }));
  }
  function readCode(text) {
    try {
      var raw = String(text || "").trim();
      if (raw.indexOf("RTP1.") !== 0) { return false; }
      var p = JSON.parse(window.atob(raw.slice(5)));
      if (!p || !Array.isArray(p.d) || !Array.isArray(p.y)) { return false; }
      // A loaded code replaces what is here, the same as clearing and ticking again.
      var best = typeof p.b === "number" ? p.b : 0;
      clearAll();
      var now = state.r + 1;
      p.d.forEach(function (id) { if (KNOWN[id]) { state.m[id] = now; } });
      p.y.forEach(function (k) { if (DAY_RE.test(k)) { state.y[k] = now; } });
      state.best = best;
      save();
      return true;
    } catch (e) { return false; }
  }

  function renderMenu() {
    var v = document.getElementById("view-menu");
    v.textContent = "";
    var jump = h("div", { class: "jump" });
    [["Sync", "menu-sync"], ["Settings", "menu-settings"], ["The four places", "menu-places"], ["Rules", "menu-rules"], ["Template", "menu-template"], ["Audit", "menu-audit"]].forEach(function (j) {
      var b = h("button", { type: "button", text: j[0] });
      b.addEventListener("click", function () { document.getElementById(j[1]).scrollIntoView({ block: "start" }); });
      jump.appendChild(b);
    });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> MENU" }),
      h("h1", { text: "Syncing, settings and info" }),
      jump
    ]));
    v.appendChild(h("div", { class: "block panel", id: "menu-sync" }));
    v.appendChild(h("div", { class: "block panel", id: "menu-settings" }));

    var rows = h("div", { class: "rows" });
    PLACES.forEach(function (p) {
      rows.appendChild(h("div", { class: "row" }, [h("div", null, [link(p[0], p[1])]), h("div", { class: "meta", text: p[2] }), h("p", { text: p[3] })]));
    });
    v.appendChild(h("div", { class: "block", id: "menu-places" }, [
      h("h2", { text: "The four places, and why" }),
      h("p", { class: "lede", text: "Four places, one job each. All free, all in a web browser. The list changes only when a fact changes, and the audit below says what changed." }),
      rows
    ]));

    v.appendChild(h("div", { class: "block", id: "menu-rules" }, [h("h2", { text: "Rules that keep you safe and hireable" }), bullets(RULES)]));

    var status = h("span", { class: "status-line", role: "status" });
    var pre = h("pre", { class: "template", id: "template", text: TEMPLATE });
    var copy = h("button", { type: "button", id: "copy-template", text: "Copy template" });
    copy.addEventListener("click", function () { copyText(TEMPLATE, status, pre); });
    v.appendChild(h("div", { class: "block", id: "menu-template" }, [h("h2", { text: "Write-up template" }), pre, h("div", { class: "btnrow" }, [copy, status])]));

    var counts = { ok: 0, no: 0, changed: 0 };
    AUDIT.forEach(function (a) { counts[a[0]] += 1; });
    var label = { ok: "CHECKED", no: "NOT CHECKED", changed: "CORRECTED" };
    var audit = h("div", { class: "rows" });
    AUDIT.forEach(function (a) {
      audit.appendChild(h("div", { class: "row" }, [
        h("div", null, [h("span", { class: "pill " + a[0], text: label[a[0]] }), a[1]]),
        h("p", { class: "dim", text: a[2] })
      ]));
    });
    v.appendChild(h("div", { class: "block", id: "menu-audit" }, [
      h("div", { class: "eyebrow", text: "> AUDIT · " + AUDIT_DATE.toUpperCase() }),
      h("h2", { text: "What was checked, and what was not" }),
      h("p", { class: "lede", text: counts.ok + " claims checked against their source, " + counts.changed + " corrected, " + counts.no + " that nobody can check or promise." }),
      audit
    ]));
    syncPanel();
    settingsPanel();
  }

  // ---------- frame ----------
  var TABS = ["now", "path", "words", "jobs", "menu"];
  var OLD_TABS = { next: "now", info: "menu", why: "menu", audit: "menu" }; // links saved before the tabs changed still land somewhere useful
  function currentTab() {
    var name = (window.location.hash || "#now").slice(1);
    name = OLD_TABS[name] || name;
    return TABS.indexOf(name) === -1 ? "now" : name;
  }
  function showTab() {
    var name = currentTab();
    TABS.forEach(function (t) { document.getElementById("view-" + t).hidden = t !== name; });
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar a, #menu-btn"), function (a) {
      if (a.getAttribute("data-tab") === name) { a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
    });
  }
  function showPlace() {
    // On the Path tab, bring "you are here" into view.
    var here = document.querySelector("#view-path .line.here");
    if (currentTab() === "path" && here) { here.scrollIntoView({ block: "center" }); } else { window.scrollTo(0, 0); }
  }
  function renderStatus(idx) {
    var n = SEQ.filter(function (e) { return isDone(e.it.id); }).length;
    document.getElementById("barfill").style.width = (SEQ.length ? (n / SEQ.length) * 100 : 0) + "%";
    document.getElementById("count-label").textContent = n + " OF " + SEQ.length + " DONE";
    document.getElementById("step-label").textContent = idx === -1 ? "COMPLETE" : "STEP " + (SEQ[idx].s + 1) + " OF " + STEPS.length;
    document.documentElement.setAttribute("data-theme", state.theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", state.theme === "dark" ? "#0B0E13" : "#EDF0F4"); }
  }
  function render(focusId) {
    var idx = currentIndex();
    renderStatus(idx);
    renderNow(idx);
    renderPath(idx);
    settingsPanel();
    if (focusId) {
      var again = document.getElementById(focusId);
      if (again) { again.focus({ preventScroll: true }); }
    }
  }
  function takeLink() {
    // Opening a sync link (…#sync=code) joins that code, then removes the code from the address bar.
    var m = /^#sync=(.*)$/.exec(window.location.hash || "");
    if (!m) { return false; }
    var code = findCode(m[1]);
    window.history.replaceState(null, "", "#menu");
    if (code) { startSync(code); }
    return true;
  }

  window.addEventListener("hashchange", function () {
    if (takeLink()) { syncPanel(); }
    showTab();
    showPlace();
  });
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("online", wake);
  window.addEventListener("pageshow", function (e) { if (e.persisted) { wake(); } });

  load();
  var joined = takeLink();
  renderWords();
  renderJobs();
  renderMenu();
  render();
  showTab();
  if (!joined && state.sync) { setStatus("saving"); pull(); listen(); } else { setStatus(sync.status); }
})();
