// Red Team Path: one fixed path into AI red teaming, with ticks that save in this browser.
// Everything is stored under one key (STORE_KEY). If saving fails, a warning shows and the app keeps working in memory.
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
        ? item("g" + d, "practice", "Gray Swan: " + p.title, "You try on a scored target what today's course day taught.", URLS.gs + p.slug)
        : item("g" + d, "practice", "Gray Swan: a live prize contest if one is open, or your favourite set", "You finish the course by testing yourself where it counts.", URLS.gsChallenges));
      if (WRITEUP_ON[d]) {
        items.push(item("w" + WRITEUP_ON[d], "writeup", d === 21
          ? "Write-up 5: your final project report, if the course allows sharing it"
          : "Write-up " + WRITEUP_ON[d] + ": write down one attack you did, using the template on the Info tab",
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

  // ---------- jobs: every ad below was read on 16 or 17 Nov 2026. [title, who, pay as posted, what it asked] ----------
  var JOBS_DATE = "17 Nov 2026";
  var HONEST = [
    "Most work a beginner can get is contract work, paid by the hour through AI-training platforms. It comes project by project, and hours are not guaranteed.",
    "Some ads are talent pools: you apply, pass a test or an AI interview, then wait for a project. A posted rate is not an offer.",
    "Several contract ads asked for no degree and no technical background. Others asked for a degree or equal work experience.",
    "Full-time jobs exist, but the engineer-level ads read for this page asked for experience in security, coding or machine learning.",
    "Nobody can promise a job. This path builds proof you can show."
  ];
  var RUNGS = [
    { name: "Contract red-team tester",
      what: "You are paid by the hour to attack AI models for a client, log every attempt and write up what worked.",
      when: "You can apply during step 2. Write-ups and Gray Swan results raise your odds.",
      ads: [
        ["AI Red Team Tester (General)", "Alignerr", "$40 to $120 an hour, currency not stated", "Said no technical background is required."],
        ["Safety Testing Associate", "Clera", "US$30 to US$60 an hour", "Said earlier AI data work is not required."],
        ["LLM Jailbreak Red Teamer", "Claru", "$55 to $100 an hour, currency not stated", "Wanted security people, CTF players, or anyone who has spent time stress-testing systems."],
        ["AI Jailbreak & Prompt-Injection Security Expert", "micro1", "US$50 to US$90 an hour", "Preferred 2 or more years of LLM red teaming."],
        ["AI Red-Teamer, Adversarial AI Testing", "Mercor", "US$50 to US$111 an hour", "Asked for a bachelor's degree or equal work experience. It had closed by 17 Nov."],
        ["Generative AI Associate, Red Teaming", "Innodata", "about US$14 an hour, from older listings", "The low end. Nothing was open on its own job board on 17 Nov."]
      ] },
    { name: "Safety rater or evaluator",
      what: "Not red teaming: you rate or label AI answers against safety rules. The same companies hire for it, so it can be a way in.",
      when: "Open to try at any point.",
      ads: [
        ["Data Annotation Specialist, Safety", "Cohere", "CA$45 an hour", "A 12-month contract at 16 or more hours a week. Preferred a year of content moderation or similar. Involves disturbing text."],
        ["Prompt & Response Evaluator", "micro1", "US$45 to US$70 an hour", "A short project of about 7.5 hours in total."]
      ] },
    { name: "Engineer-level red teamer",
      what: "A full-time or senior role: you design attacks, build tests in code and report to the teams that fix them.",
      when: "Worth applying once you have Python, public write-ups, and a contest placing or bounty credit.",
      ads: [
        ["AI Red Team Engineer", "White Circle, and Carnegie Mellon University", "pay not noted", "Both asked for Python."],
        ["AI Security Red Team Engineer", "DataAnnotation", "US$40 or more an hour", "Required 2 or more years of hands-on cybersecurity, plus some coding."],
        ["Red Team Engineer", "Gray Swan AI", "US$110,000 to US$290,000 a year, as listed on Remotive", "Senior, and open to people in the United States only."],
        ["AI Red Teamer (Entry Level)", "10a Labs", "about US$60,000 to US$70,000 a year on job sites", "Closed: it was not on the company's own job board on 17 Nov. It is the only entry-level salaried ad that was found."]
      ] }
  ];
  var SEARCH_WORDS = "AI red teamer, LLM red team, adversarial testing, jailbreak, prompt injection, AI safety tester";
  var LOOK = [
    ["Alignerr", "https://www.alignerr.com/jobs", "Contract AI testing and rating projects."],
    ["Mercor", "https://work.mercor.com/explore", "Contract projects. Ads open and close quickly."],
    ["micro1", "https://www.micro1.ai/experts/opportunities", "Contract projects, usually with an AI interview first."],
    ["Clera", "https://jobs.ashbyhq.com/Clera", "Talent pools for safety testing and evaluation."],
    ["Claru", "https://claru.ai/jobs", "Contract projects. You create a profile, then join projects as they open."],
    ["OpenTrain", "https://www.opentrain.ai/jobs", "A job board for AI training work from many companies."],
    ["aitraining.jobs", "https://aitraining.jobs/roles/red-teaming", "A job board with a red-teaming section."],
    ["Gray Swan challenges", URLS.gsChallenges, "Prize contests. A placing counts as proof."]
  ];
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
    ["ok", "Every link in the app opens the right page.", "Opened on 17 Nov 2026: all 21 lesson pages, 9 Gray Swan pages, the Microsoft, freeCodeCamp, 0DIN and Anthropic pages, and the 7 job sites."],
    ["ok", "The job titles, pay and asks on the Jobs tab come from real ads.", "Each ad was read on 16 or 17 Nov 2026. Ads close and pay changes, so they are examples, not offers."],
    ["no", "A posted hourly rate is what you would earn.", "A range in an ad is not an offer, and contract platforms do not guarantee hours."],
    ["no", "The Words tab is an official glossary.", "The meanings are plain-English summaries written for this app and matched to lesson titles. The courses are the authority."],
    ["no", "Finishing this path gets you hired.", "Nobody can promise that. The path builds the things a newcomer can show: write-ups, contest results, a known course and basic Python."]
  ];

  // ---------- saving ----------
  var STORE_KEY = "redTeamPath.v2";
  var state = { done: {}, days: {}, best: 0, dial: 4, theme: "dark", open: {}, test: false };
  var storageOk = true;

  function storageFailed() {
    storageOk = false;
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
    if (p.done && typeof p.done === "object") { state.done = p.done; }
    if (p.days && typeof p.days === "object") { state.days = p.days; }
    if (typeof p.best === "number") { state.best = p.best; }
    if (p.dial === 1 || p.dial === 2 || p.dial === 4) { state.dial = p.dial; }
    if (p.theme === "light" || p.theme === "dark") { state.theme = p.theme; }
    if (p.open && typeof p.open === "object") { state.open = p.open; }
    if (p.test === true) { state.test = true; }
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
  function stepItems(step) {
    var all = [];
    step.groups.forEach(function (g) { g.items.forEach(function (it) { all.push(it); }); });
    return all;
  }
  function required(items) { return items.filter(function (it) { return !it.optional; }); }
  function doneCount(items) { return items.filter(function (it) { return !!state.done[it.id]; }).length; }
  function allRequired() {
    var all = [];
    STEPS.forEach(function (s) { all = all.concat(required(stepItems(s))); });
    return all;
  }
  function dueNow(it) { return !it.optional; }
  // Where you are: the first group that still has an unticked box.
  function current() {
    for (var s = 0; s < STEPS.length; s += 1) {
      for (var g = 0; g < STEPS[s].groups.length; g += 1) {
        var left = STEPS[s].groups[g].items.filter(function (it) { return dueNow(it) && !state.done[it.id]; });
        if (left.length) { return { s: s, g: g }; }
      }
    }
    return null;
  }
  function dayKey(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function streak() {
    var d = new Date();
    if (!state.days[dayKey(d)]) { d.setDate(d.getDate() - 1); } // today not ticked yet: the run still counts through yesterday
    var n = 0;
    while (state.days[dayKey(d)]) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  }
  function timeFor(it) {
    if (it.kind === "course") { return "45 TO 75 MIN"; }
    if (it.kind === "practice") { return state.dial >= 4 ? "ABOUT 2.5 H" : "ABOUT 45 MIN"; }
    if (it.kind === "writeup") { return "ABOUT 20 MIN"; }
    return "";
  }
  function setDone(it, on) {
    if (on) {
      state.done[it.id] = 1;
      state.days[dayKey(new Date())] = 1;
      state.best = Math.max(state.best, streak());
    } else {
      delete state.done[it.id];
    }
    save();
  }

  // ---------- views ----------
  function card(it, groupLabel) {
    var isDone = !!state.done[it.id];
    var box = h("input", { type: "checkbox", id: "next-" + it.id });
    box.checked = isDone;
    box.addEventListener("change", function () { setDone(it, box.checked); render("next-" + it.id); });
    var tag = [groupLabel, KIND[it.kind], timeFor(it)].filter(Boolean).join(" · ");
    var why = it.why;
    return h("div", { class: "card" + (isDone ? " done" : "") }, [
      h("div", { class: "tag", text: tag }),
      h("div", { class: "title", text: it.title }),
      why ? h("div", { class: "why" }, [h("b", { text: "WHY " }), why]) : null,
      h("div", { class: "acts" }, [
        h("label", { class: "check", for: "next-" + it.id }, [box, "Mark done"]),
        it.url ? link("OPEN ↗", it.url, "open") : null
      ])
    ]);
  }

  function renderNext(cur) {
    var v = document.getElementById("view-next");
    v.textContent = "";
    if (!cur) {
      v.appendChild(h("div", { class: "block" }, [
        h("div", { class: "eyebrow", text: "> PATH COMPLETE" }),
        h("h1", { text: "Every box is ticked" }),
        h("p", { class: "lede", text: "Keep entering Gray Swan contests and keep writing up what you find." })
      ]));
      return;
    }
    var step = STEPS[cur.s];
    var group = step.groups[cur.g];
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> NEXT · " + step.short }),
      h("h1", { text: step.title }),
      h("p", { class: "lede", text: step.goal }),
      step.why ? h("p", { class: "why" }, [h("b", { text: "WHY " }), step.why]) : null
    ]));
    var due = group.items.filter(dueNow);
    var show = due;
    if (!group.label) {
      // Long lists (videos, Python sections): show only the next few unticked boxes.
      var limit = step.short === "VIDEOS" ? (state.dial === 1 ? 2 : state.dial === 2 ? 3 : 5) : 1;
      show = due.filter(function (it) { return !state.done[it.id]; }).slice(0, limit);
    }
    if (group.label && state.dial === 1) {
      // 1 hour a day: the course day is one sitting, the practice (and any write-up) is the next.
      var course = due.filter(function (it) { return it.kind === "course"; });
      var courseLeft = course.some(function (it) { return !state.done[it.id]; });
      show = courseLeft ? course : due.filter(function (it) { return it.kind !== "course"; });
    }
    var cards = h("div", { class: "block" });
    show.forEach(function (it) { cards.appendChild(card(it, group.label)); });
    v.appendChild(cards);
    if (step.short === "COURSE + PRACTICE" && state.dial === 1) {
      v.appendChild(h("p", { class: "note", text: "At 1 hour a day the course and Gray Swan take turns: the course day in one sitting, the practice in the next. Nothing is skipped; step 2 just takes about twice as many days. Stop Gray Swan when your hour is up, solved or not." }));
    }
    if (step.short === "COURSE + PRACTICE" && state.dial >= 2) {
      v.appendChild(h("p", { class: "note", text: "Stop Gray Swan when your time is up, solved or not. Unsolved is normal." }));
    }
  }

  function renderPath(cur) {
    var v = document.getElementById("view-path");
    v.textContent = "";
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> PATH" }),
      h("h1", { text: "Four steps, top to bottom" }),
      h("p", { class: "lede", text: "Days are not tied to dates. Tick a box when it is done." })
    ]));
    STEPS.forEach(function (step, s) {
      var req = required(stepItems(step));
      var n = doneCount(req);
      var det = h("details", { class: "step" + (n === req.length ? " complete" : ""), id: "step-" + (s + 1) });
      det.open = state.open[s] !== undefined ? !!state.open[s] : !!(cur && cur.s === s);
      det.addEventListener("toggle", function () { state.open[s] = det.open ? 1 : 0; save(); });
      det.appendChild(h("summary", null, [
        h("span", { class: "stitle", text: step.title }),
        h("span", { class: "scount", text: n + "/" + req.length }),
        h("span", { class: "sgoal", text: step.goal })
      ]));
      var body = h("div", { class: "sbody" });
      step.groups.forEach(function (group, g) {
        var isCur = !!(cur && cur.s === s && cur.g === g);
        var grp = h("div", { class: "grp" + (isCur && group.label ? " current" : "") });
        if (group.label) { grp.appendChild(h("div", { class: "glabel", text: group.label + (isCur ? " · YOU ARE HERE" : "") })); }
        group.items.forEach(function (it) {
          var id = "path-" + it.id;
          var box = h("input", { type: "checkbox", id: id });
          box.checked = !!state.done[it.id];
          box.addEventListener("change", function () { setDone(it, box.checked); render(id); });
          grp.appendChild(h("div", { class: "line" + (state.done[it.id] ? " done" : "") }, [
            box,
            h("label", { for: id }, [h("span", { class: "k", text: KIND[it.kind] }), it.title]),
            it.url ? h("a", { href: it.url, target: "_blank", rel: "noopener", class: "go", "aria-label": "Open: " + it.title, text: "\u2197" }) : null
          ]));
        });
        body.appendChild(grp);
      });
      det.appendChild(body);
      v.appendChild(det);
    });
    v.appendChild(backupPanel());
  }

  function backupPanel() {
    var status = h("span", { class: "status-line", role: "status", id: "backup-status" });
    var area = h("textarea", { id: "backup-code", "aria-label": "Progress code", placeholder: "Paste a progress code here, then press Load this code." });
    var copyBtn = h("button", { type: "button", id: "backup-copy", text: "Copy my progress" });
    copyBtn.addEventListener("click", function () {
      var code = makeCode();
      area.value = code;
      function fallback() { area.focus(); area.select(); status.textContent = "Code is in the box. Copy it from there."; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { status.textContent = "Copied. Paste it into this app on another device."; }, fallback);
      } else { fallback(); }
    });
    var loadBtn = h("button", { type: "button", id: "backup-load", text: "Load this code" });
    loadBtn.addEventListener("click", function () {
      var ok = readCode(area.value);
      if (ok) { save(); render(); document.getElementById("backup-status").textContent = "Loaded. Your ticks are back."; }
      else { status.textContent = "That code did not work. Copy the whole code and try again."; }
    });
    var clearAsk = h("button", { type: "button", class: "ghost", id: "clear-ask", text: "CLEAR ALL TICKS" });
    var clearYes = h("button", { type: "button", id: "clear-yes", text: "Yes, clear them" });
    var clearNo = h("button", { type: "button", id: "clear-no", text: "Keep them" });
    var confirmRow = h("span", { class: "btnrow", hidden: "" }, [h("span", { class: "status-line", text: "Clear every tick and the streak?" }), clearYes, clearNo]);
    clearAsk.addEventListener("click", function () { confirmRow.hidden = false; clearAsk.hidden = true; });
    clearNo.addEventListener("click", function () { confirmRow.hidden = true; clearAsk.hidden = false; });
    clearYes.addEventListener("click", function () { state.done = {}; state.days = {}; state.best = 0; state.open = {}; save(); render(); });
    return h("div", { class: "block" }, [
      h("h2", { text: "Backup" }),
      h("p", { class: "lede", text: "Ticks save by themselves on this device. To move them to another device, copy your progress here and load the code there." }),
      h("div", { class: "btnrow" }, [copyBtn, loadBtn, status]),
      area,
      h("div", { class: "btnrow" }, [clearAsk, confirmRow])
    ]);
  }
  function makeCode() {
    var payload = { d: Object.keys(state.done), y: Object.keys(state.days), b: state.best, t: state.dial };
    return "RTP1." + window.btoa(JSON.stringify(payload));
  }
  function readCode(text) {
    try {
      var raw = String(text || "").trim();
      if (raw.indexOf("RTP1.") !== 0) { return false; }
      var p = JSON.parse(window.atob(raw.slice(5)));
      if (!p || !Array.isArray(p.d) || !Array.isArray(p.y)) { return false; }
      var known = {};
      STEPS.forEach(function (s) { stepItems(s).forEach(function (it) { known[it.id] = 1; }); });
      var done = {};
      p.d.forEach(function (id) { if (known[id]) { done[id] = 1; } });
      var days = {};
      p.y.forEach(function (k) { if (/^\d{4}-\d{2}-\d{2}$/.test(k)) { days[k] = 1; } });
      state.done = done;
      state.days = days;
      state.best = typeof p.b === "number" ? p.b : 0;
      if (p.t === 1 || p.t === 2 || p.t === 4) { state.dial = p.t; }
      return true;
    } catch (e) { return false; }
  }

  function bullets(items) {
    var ul = h("ul", { class: "plain" });
    items.forEach(function (x) { ul.appendChild(h("li", { text: x })); });
    return ul;
  }

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
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> WORDS · " + total }),
      h("h1", { text: "The words you will hear" }),
      h("p", { class: "lede", text: "Plain-English meanings. The tag shows the video or course day where the word comes up." }),
      h("div", { class: "btnrow" }, [toggle, h("span", { class: "status-line", role: "status",
        text: state.test ? "Say the meaning in your head, then tap the word to check." : "Turn this on to hide the meanings and check yourself." })])
    ]));
    WORDS.forEach(function (g) {
      var list = h("div", { class: "rows" });
      g[1].forEach(function (w) {
        var det = h("details", { class: "word" });
        det.open = !state.test;
        det.appendChild(h("summary", null, [h("span", { class: "term", text: w[0] }), w[1] ? h("span", { class: "where", text: w[1] }) : null]));
        det.appendChild(h("p", { text: w[2] }));
        list.appendChild(det);
      });
      v.appendChild(h("div", { class: "block" }, [h("h2", { text: g[0] }), list]));
    });
  }

  function renderJobs() {
    var v = document.getElementById("view-jobs");
    v.textContent = "";
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> JOBS · ADS READ " + JOBS_DATE.toUpperCase() }),
      h("h1", { text: "Where this can lead" }),
      h("p", { class: "lede", text: "The job titles, pay and asks below come from real ads read on 16 and 17 Nov 2026. Ads close and pay changes, so treat every number as an example, not a promise." })
    ]));
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "The honest picture" }), bullets(HONEST)]));

    RUNGS.forEach(function (r, i) {
      var ads = h("div", { class: "rows" });
      r.ads.forEach(function (a) {
        ads.appendChild(h("div", { class: "row" }, [
          h("div", null, [h("strong", { text: a[0] })]),
          h("div", { class: "meta", text: a[1] + " · " + a[2] }),
          h("p", { text: a[3] })
        ]));
      });
      v.appendChild(h("div", { class: "block rung" }, [
        h("div", { class: "eyebrow", text: "RUNG " + (i + 1) + " OF " + RUNGS.length }),
        h("h2", { text: r.name }),
        h("p", { text: r.what }),
        h("p", { class: "why" }, [h("b", { text: "WHEN " }), r.when]),
        h("div", { class: "meta-line", text: "TITLES SEEN ON REAL ADS" }),
        ads
      ]));
    });

    v.appendChild(h("div", { class: "block" }, [
      h("h2", { text: "What to show instead of a degree" }),
      h("p", { class: "lede", text: "Each step of the path leaves you with one of these." }),
      bullets(PROOF)
    ]));

    var look = h("div", { class: "rows" });
    LOOK.forEach(function (l) {
      look.appendChild(h("div", { class: "row" }, [h("div", null, [link(l[0], l[1])]), h("p", { text: l[2] })]));
    });
    v.appendChild(h("div", { class: "block" }, [
      h("h2", { text: "Where to look" }),
      h("p", { class: "lede", text: "Search words that work: " + SEARCH_WORDS + "." }),
      look
    ]));

    var money = h("div", { class: "rows" });
    MONEY.forEach(function (m, i) {
      money.appendChild(h("div", { class: "row" }, [h("div", { class: "meta", text: "ROUTE " + (i + 1) }), h("div", null, [h("strong", { text: m[0] })]), h("p", { text: m[1] })]));
    });
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "Four ways this can pay" }), h("p", { class: "lede", text: "Easiest first. Nobody can promise any of it." }), money]));

    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "Before you apply anywhere" }), bullets(APPLY_RULES)]));
  }

  function renderInfo() {
    var v = document.getElementById("view-info");
    v.textContent = "";
    var jump = h("div", { class: "jump" });
    [["Places", "info-places"], ["Rules", "info-rules"], ["Template", "info-template"], ["Audit", "info-audit"]].forEach(function (j) {
      var b = h("button", { type: "button", text: j[0] });
      b.addEventListener("click", function () { document.getElementById(j[1]).scrollIntoView({ block: "start" }); });
      jump.appendChild(b);
    });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> INFO" }),
      h("h1", { text: "Why this path, and how it was checked" }),
      h("p", { class: "lede", text: "Four places, one job each. All free, all in a web browser. The list changes only when a fact changes, and the audit below says what changed." }),
      jump
    ]));

    var rows = h("div", { class: "rows" });
    PLACES.forEach(function (p) {
      rows.appendChild(h("div", { class: "row" }, [h("div", null, [link(p[0], p[1])]), h("div", { class: "meta", text: p[2] }), h("p", { text: p[3] })]));
    });
    v.appendChild(h("div", { class: "block", id: "info-places" }, [h("h2", { text: "The four places" }), rows]));

    v.appendChild(h("div", { class: "block", id: "info-rules" }, [h("h2", { text: "Rules that keep you safe and hireable" }), bullets(RULES)]));

    var status = h("span", { class: "status-line", role: "status" });
    var pre = h("pre", { class: "template", id: "template", text: TEMPLATE });
    var copy = h("button", { type: "button", id: "copy-template", text: "Copy template" });
    copy.addEventListener("click", function () {
      function selectIt() {
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        status.textContent = "Selected. Copy it from here.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(TEMPLATE).then(function () { status.textContent = "Copied."; }, selectIt);
      } else { selectIt(); }
    });
    v.appendChild(h("div", { class: "block", id: "info-template" }, [h("h2", { text: "Write-up template" }), pre, h("div", { class: "btnrow" }, [copy, status])]));

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
    v.appendChild(h("div", { class: "block", id: "info-audit" }, [
      h("div", { class: "eyebrow", text: "> AUDIT · " + AUDIT_DATE.toUpperCase() }),
      h("h2", { text: "What was checked, and what was not" }),
      h("p", { class: "lede", text: counts.ok + " claims checked against their source, " + counts.changed + " corrected, " + counts.no + " that nobody can check or promise." }),
      audit
    ]));
  }

  // ---------- frame ----------
  var TABS = ["next", "path", "words", "jobs", "info"];
  var OLD_TABS = { why: "info", audit: "info" }; // links saved before the tabs changed still land somewhere useful
  function currentTab() {
    var name = (window.location.hash || "#next").slice(1);
    name = OLD_TABS[name] || name;
    return TABS.indexOf(name) === -1 ? "next" : name;
  }
  function showTab() {
    var name = currentTab();
    TABS.forEach(function (t) { document.getElementById("view-" + t).hidden = t !== name; });
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar a"), function (a) {
      if (a.getAttribute("data-tab") === name) { a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
    });
  }
  function renderStatus(cur) {
    var req = allRequired();
    var n = doneCount(req);
    document.getElementById("barfill").style.width = (req.length ? (n / req.length) * 100 : 0) + "%";
    document.getElementById("count-label").textContent = n + "/" + req.length;
    document.getElementById("step-label").textContent = cur ? "STEP " + (cur.s + 1) + "/" + STEPS.length : "COMPLETE";
    var run = streak();
    var chip = document.getElementById("streak");
    chip.textContent = "STREAK " + run + "D";
    chip.className = "chip" + (run > 0 ? " live" : "");
    chip.title = "Days in a row with at least one box ticked. Best run: " + state.best + " days.";
    Array.prototype.forEach.call(document.querySelectorAll(".dial button"), function (b) {
      b.setAttribute("aria-pressed", Number(b.getAttribute("data-dial")) === state.dial ? "true" : "false");
    });
    document.documentElement.setAttribute("data-theme", state.theme);
    document.getElementById("theme-btn").textContent = state.theme === "dark" ? "LIGHT" : "DARK";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", state.theme === "dark" ? "#0B0E13" : "#EDF0F4"); }
  }
  function render(focusId) {
    var cur = current();
    renderStatus(cur);
    renderNext(cur);
    renderPath(cur);
    if (focusId) {
      var again = document.getElementById(focusId);
      if (again) { again.focus({ preventScroll: true }); }
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".dial button"), function (b) {
    b.addEventListener("click", function () { state.dial = Number(b.getAttribute("data-dial")); save(); render(); });
  });
  document.getElementById("theme-btn").addEventListener("click", function () {
    state.theme = state.theme === "dark" ? "light" : "dark";
    save();
    render();
  });
  window.addEventListener("hashchange", function () { showTab(); window.scrollTo(0, 0); });

  load();
  renderWords();
  renderJobs();
  renderInfo();
  render();
  showTab();
})();
