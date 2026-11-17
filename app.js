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

  // tier = the smallest time setting at which the item is part of your day
  function item(id, kind, title, why, url, tier, extra) {
    var it = { id: id, kind: kind, title: title, why: why || "", url: url || "", tier: tier || 1, optional: false };
    if (extra) { Object.keys(extra).forEach(function (k) { it[k] = extra[k]; }); }
    return it;
  }

  function buildSteps() {
    var videos = VIDEOS.map(function (t, i) {
      return item("v" + (i + 1), "video", "Episode " + (i + 1) + ": " + t,
        i >= 7 ? "This one shows an automation tool. Watch it, install nothing." : "", URLS.ms, 1);
    });

    var days = COURSE.map(function (c, i) {
      var d = i + 1;
      var items = [item("c" + d, "course", "Course day " + d + ": " + c[0], c[1], URLS.se + SE_DAYS[i] + "/", 1)];
      var p = PRACTICE[i];
      items.push(p
        ? item("g" + d, "practice", "Gray Swan: " + p.title, "You try on a scored target what today's course day taught.", URLS.gs + p.slug, 2)
        : item("g" + d, "practice", "Gray Swan: a live prize contest if one is open, or your favourite set", "You finish the course by testing yourself where it counts.", URLS.gsChallenges, 2));
      if (WRITEUP_ON[d]) {
        items.push(item("w" + WRITEUP_ON[d], "writeup", d === 21
          ? "Write-up 5: your final project report, if the course allows sharing it"
          : "Write-up " + WRITEUP_ON[d] + ": write down one attack you did, using the template on the Why tab",
          "Write-ups are the proof employers and contest organisers ask to see.", "", 2));
      }
      return { label: "DAY " + (d < 10 ? "0" + d : d), items: items };
    });

    var python = PYTHON.map(function (s, i) {
      return item("py" + (i + 1), "code", s[0] + ", " + s[1] + " steps",
        i === 0 ? "You learn to read and write simple Python. Skip the short 'Install Python' section: everything runs in the browser." : "", URLS.fcc, 1);
    });
    python.push(item("py6", "code", "Optional: finish the rest, pass the 5 projects and the free exam for the certificate",
      "The certificate is free, but the rest of the course is long. Do it only if you want the certificate.", URLS.fcc, 1, { optional: true }));

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
          item("b1", "bounty", "Read Mozilla 0DIN's rules fully. Note what pays and what does not.", "", URLS.odin, 1),
          item("b2", "bounty", "Test 3 ideas, only inside 0DIN's rules. Save every prompt and result, and keep them private.", "", "", 1),
          item("b3", "bounty", "Decide honestly whether one is a real, new finding. If yes, send 0DIN the short summary it asks for.", "", URLS.odin, 1),
          item("b4", "bounty", "Apply to Anthropic's model safety bug bounty, using your write-ups and results.", "", URLS.anthropic, 1)
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
    ["ok", "AI red-team job ads ask for Python.", "Several 2026 postings ask for Python or basic scripting, including an entry-level one. This is a sample of ads, not a survey."],
    ["no", "Finishing this path gets you hired.", "Nobody can promise that. The path builds the things a newcomer can show: write-ups, contest results, a known course and basic Python."]
  ];

  // ---------- saving ----------
  var STORE_KEY = "redTeamPath.v2";
  var state = { done: {}, days: {}, best: 0, dial: 4, theme: "dark", open: {} };
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
  function dueNow(it) { return !it.optional && it.tier <= state.dial; }
  // Where you are: the first group that still has an unticked box for today's time setting.
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
  function card(it, groupLabel, stepWhy) {
    var isDone = !!state.done[it.id];
    var box = h("input", { type: "checkbox", id: "next-" + it.id });
    box.checked = isDone;
    box.addEventListener("change", function () { setDone(it, box.checked); render("next-" + it.id); });
    var tag = [groupLabel, KIND[it.kind], timeFor(it)].filter(Boolean).join(" · ");
    var why = it.why || stepWhy;
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
        h("h1", { text: "Every box for this time setting is ticked" }),
        h("p", { class: "lede", text: state.dial < 4 ? "Turn the time setting up to see the practice you skipped." : "Keep entering Gray Swan contests and keep writing up what you find." })
      ]));
      return;
    }
    var step = STEPS[cur.s];
    var group = step.groups[cur.g];
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> NEXT · " + step.short }),
      h("h1", { text: step.title }),
      h("p", { class: "lede", text: step.goal })
    ]));
    var due = group.items.filter(dueNow);
    var show = due;
    if (!group.label) {
      // Long lists (videos, Python sections): show only the next few unticked boxes.
      var limit = step.short === "VIDEOS" ? (state.dial === 1 ? 2 : state.dial === 2 ? 3 : 5) : 1;
      show = due.filter(function (it) { return !state.done[it.id]; }).slice(0, limit);
    }
    var cards = h("div", { class: "block" });
    show.forEach(function (it) { cards.appendChild(card(it, group.label, step.why)); });
    v.appendChild(cards);
    if (step.short === "COURSE + PRACTICE" && state.dial === 1) {
      v.appendChild(h("p", { class: "note", text: "At 1 hour a day you do the course only. Gray Swan practice and write-ups wait, and come back when you turn the time setting up." }));
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
            h("label", { for: id }, [h("span", { class: "k", text: KIND[it.kind] }), it.title])
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

  function renderWhy() {
    var v = document.getElementById("view-why");
    v.textContent = "";
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> WHY" }),
      h("h1", { text: "Four places, one job each" }),
      h("p", { class: "lede", text: "All free. All run in a web browser. This list changes only when a fact changes, and the Audit tab says what changed." })
    ]));
    var rows = h("div", { class: "rows" });
    PLACES.forEach(function (p) {
      rows.appendChild(h("div", { class: "row" }, [h("div", null, [link(p[0], p[1])]), h("div", { class: "meta", text: p[2] }), h("p", { text: p[3] })]));
    });
    v.appendChild(rows);

    var money = h("div", { class: "rows" });
    MONEY.forEach(function (m, i) {
      money.appendChild(h("div", { class: "row" }, [h("div", { class: "meta", text: "ROUTE " + (i + 1) }), h("div", null, [h("strong", { text: m[0] })]), h("p", { text: m[1] })]));
    });
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "How this can pay" }), h("p", { class: "lede", text: "Easiest first. Nobody can promise any of it." }), money]));

    var rules = h("ul", { class: "plain" });
    RULES.forEach(function (r) { rules.appendChild(h("li", { text: r })); });
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "Rules that keep you safe and hireable" }), rules]));

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
    v.appendChild(h("div", { class: "block" }, [h("h2", { text: "Write-up template" }), pre, h("div", { class: "btnrow" }, [copy, status])]));
  }

  function renderAudit() {
    var v = document.getElementById("view-audit");
    v.textContent = "";
    var counts = { ok: 0, no: 0, changed: 0 };
    AUDIT.forEach(function (a) { counts[a[0]] += 1; });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> AUDIT · " + AUDIT_DATE.toUpperCase() }),
      h("h1", { text: "What was checked, and what was not" }),
      h("p", { class: "lede", text: counts.ok + " claims checked against their source, " + counts.changed + " corrected, " + counts.no + " that nobody can check or promise." })
    ]));
    var label = { ok: "CHECKED", no: "NOT CHECKED", changed: "CORRECTED" };
    var rows = h("div", { class: "rows" });
    AUDIT.forEach(function (a) {
      rows.appendChild(h("div", { class: "row" }, [
        h("div", null, [h("span", { class: "pill " + a[0], text: label[a[0]] }), a[1]]),
        h("p", { class: "dim", text: a[2] })
      ]));
    });
    v.appendChild(rows);
  }

  // ---------- frame ----------
  var TABS = ["next", "path", "why", "audit"];
  function currentTab() {
    var name = (window.location.hash || "#next").slice(1);
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
  renderWhy();
  renderAudit();
  render();
  showTab();
})();
