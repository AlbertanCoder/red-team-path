// Red Team Path: one fixed path into AI red teaming, with ticks that save in this browser and can sync between devices.
// The path is built around one name, Microsoft: its 10 videos, each followed by its own lab, its AI security course,
// its Python course and its automation tool. Two named extras cover what Microsoft does not offer: Gray Swan for scored
// practice on agents, and the Mozilla and Anthropic bounty programs.
// On the device everything is stored under one key (STORE_KEY). If saving fails, a warning shows and the app keeps working in memory.
// Linking devices is optional: a private code, kept on the device, names one spot in a small online store that holds ticks only.
(function () {
  "use strict";

  // ---------- links ----------
  var LEARN = "https://learn.microsoft.com/en-us";
  var URLS = {
    ms: "https://learn.microsoft.com/en-us/security/ai-red-team/training",
    msLabs: "https://github.com/microsoft/AI-Red-Teaming-Playground-Labs#challenges",
    msLabsSetup: "https://github.com/microsoft/AI-Red-Teaming-Playground-Labs#getting-started",
    msNotebooks: "https://github.com/microsoft/AI-Red-Teaming-Playground-Labs/tree/main/notebooks",
    learn: LEARN + "/training/",
    learnSecurity: LEARN + "/training/paths/ai-security-fundamentals/",
    learnPython1: LEARN + "/training/paths/get-started-with-python-fundamentals/",
    learnPython2: LEARN + "/training/paths/get-started-with-python-programs/",
    learnProfile: LEARN + "/users/me/achievements",
    learnTranscript: LEARN + "/users/me/transcript",
    gsTraining: "https://app.grayswan.ai/training",
    gsChallenges: "https://app.grayswan.ai/challenges",
    gs: "https://app.grayswan.ai/arena/challenge/",
    odin: "https://0din.ai/policy",
    anthropic: "https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program"
  };

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
  // Where each episode plays, copied from the players on Microsoft's own training page on 18 Nov 2026, in episode order.
  // "ms:" is Microsoft's own player, "yt:" is a YouTube video. learn/final_audit.py checks the page still lists these ten.
  var PLAYERS = [
    "ms:e2acb1fe-aab3-4b81-a0f9-ccd73542425b",
    "ms:a619383f-621a-4463-b1b2-53c7e468d30e",
    "ms:33675c36-62bb-44d3-b7ea-8cb16fad1736",
    "ms:acd3e4be-daea-4b82-9f7e-13008a6f5f6f",
    "yt:jle327dpdpw",
    "yt:HQadhDsQKgY",
    "ms:96f37319-2a2c-4c05-81a7-1cb296f8cd9d",
    "ms:1ec47c63-de7b-4695-9394-192b5bff8c79",
    "yt:B9A9X6XMXOI",
    "yt:1lJLqtlhZOs"
  ];
  function playerUrl(i) {
    var id = PLAYERS[i].slice(3);
    return PLAYERS[i].slice(0, 2) === "yt"
      ? "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&playsinline=1&rel=0"
      : "https://learn-video.azurefd.net/vod/player?id=" + id;
  }

  // Microsoft's AI Red Teaming Playground Labs: the 12 labs shown in the videos. Read from Microsoft's GitHub page on 18 Nov 2026.
  // [lab number, name as Microsoft lists it, level, what you do, the episode it goes with, a note for labs with a touchy goal]
  var TOUCHY = "Microsoft's goal for this lab is content an AI is meant to refuse, and it runs on your own AI key, whose rules still apply. Skip this one if you would rather not.";
  var MS_LABS = [
    [1, "Credential Exfiltration", "easy", "Talk the chatbot into showing the contents of a file called passwords.txt.", 3, ""],
    [2, "Extract a secret from the metaprompt", "easy", "Get the chatbot to give up a secret word from its hidden instructions, using encoding tricks.", 5, ""],
    [3, "Crescendo (Molotov Cocktail)", "easy", "Use the Crescendo attack to get instructions for a Molotov cocktail. Safety filters are off.", 6, TOUCHY],
    [4, "Crescendo (BoNT Instructions)", "easy", "Use the Crescendo attack to get instructions for producing a toxin. Safety filters are off.", 6, TOUCHY],
    [5, "Crescendo (Inflation)", "easy", "Use the Crescendo attack: push a little further each turn until the chatbot writes rude words about inflation. A harmless goal.", 6, ""],
    [6, "Indirect Prompt Injection", "easy", "Change a practice web page so the chatbot that reads it follows your hidden instruction.", 4, ""],
    [7, "Credential Exfiltration", "medium", "The passwords file again, against a chatbot that is harder to fool. Combine several techniques.", 3, ""],
    [8, "Extract a secret from the metaprompt", "medium", "The secret word again, with stronger protection. Combine several techniques.", 5, ""],
    [9, "Crescendo (Molotov Cocktail)", "medium", "The Crescendo attack again, but now a guardrail tries to stop you.", 7, TOUCHY],
    [10, "Crescendo (Molotov Cocktail)", "hard", "The same goal against a stronger guardrail.", 7, TOUCHY],
    [11, "Indirect Prompt Injection", "medium", "The practice web page again, against a chatbot that is harder to steer.", 4, ""],
    [12, "Indirect Prompt Injection", "hard", "The hardest version of the web page attack.", 4, ""]
  ];

  // Microsoft Learn modules, copied from Microsoft's own course lists on 18 Nov 2026. [title, minutes, address]
  var SECURITY = [
    ["Fundamentals of AI security", 53, "/training/modules/fundamentals-ai-security/"],
    ["AI security controls", 48, "/training/modules/ai-security-controls/"],
    ["Introduction to AI security testing", 29, "/training/modules/introduction-ai-security-testing/"]
  ];
  var PYTHON = [
    ["Write your first Python code", 39, "/training/modules/write-first-python-code/"],
    ["Work with data in Python", 48, "/training/modules/work-with-data-python/"],
    ["Install and configure Visual Studio Code", 54, "/training/modules/install-configure-visual-studio-code-python/"],
    ["Add decision-making to your code", 51, "/training/modules/add-decision-making-python/"],
    ["Repeat actions with loops", 47, "/training/modules/repeat-actions-loops-python/"],
    ["Organize data with collections", 51, "/training/modules/organize-data-with-collections-python/"],
    ["Read and write files", 55, "/training/modules/read-write-files-python/"],
    ["Write reusable code", 57, "/training/modules/write-reusable-code-python/"]
  ];

  // Gray Swan Arena sets, easiest first. [title, challenge address ending, why]
  var GRAYSWAN = [
    ["The Labyrinth, 5 starter scenarios", "onboarding-quest-1", "A gentle start: the same kind of chatbot attack you did in Microsoft's labs, now scored."],
    ["Introduction to Red Teaming Chatbots, 5 scenarios", "training-beginner-chatbot", "Chatbot attacks against real AI models."],
    ["Introduction to Red Teaming Agents, 5 scenarios", "training-beginner-agent", "Your first agents: AIs that can take actions, which Microsoft's labs do not cover."],
    ["Introduction to Indirect Prompt Injection, 8 scenarios", "training-intermediate-agent", "The web page attack from Episode 4, against agents."],
    ["The Labyrinth: Challenge Edition, 4 scenarios", "labyrinth-challenge-version", "The starter set again, harder."],
    ["Lucky Break: Level Up, 6 scenarios", "lucky-break-level-up", "A medium set that mixes techniques."],
    ["Proving Ground: the Agent set", "proving-ground", "A large set of agent targets. Do as many as an hour allows."],
    ["Proving Ground: the Indirect set", "proving-ground", "A large set of indirect prompt injection targets."]
  ];

  var KIND = { video: "VIDEO", lab: "LAB", writeup: "WRITE-UP", learn: "MICROSOFT LEARN", practice: "PRACTICE", auto: "AUTOMATION", proof: "PROOF", bounty: "BOUNTY" };

  function item(id, kind, title, why, url, extra) {
    var it = { id: id, kind: kind, title: title, why: why || "", url: url || "", optional: false };
    if (extra) { Object.keys(extra).forEach(function (k) { it[k] = extra[k]; }); }
    return it;
  }

  // The numbered "How to do this" steps for each kind of box.
  var LEARN_STEPS = [
    "Open the module and check you are signed in to Microsoft Learn (your picture shows at the top right). Signed out, it does not count.",
    "Do the units in order. They are short: most take 5 to 10 minutes.",
    "Pass the Module assessment at the end.",
    "You are done when the module shows as completed and its badge is on your Microsoft Learn profile."
  ];
  function videoSteps(n) {
    var steps = [
      "Tap Watch it here. If the video shows a play button, press it.",
      "Watch it through. When a word is new, pause and look it up on the Words tab."
    ];
    if (n >= 3 && n <= 7) { steps.push("Write down one thing from the video you want to try. The lab for this episode is the next card."); }
    else if (n >= 8) { steps.push("Just watch. These three episodes show Microsoft's tool PyRIT, which you will use yourself in step 5, after Python."); }
    else { steps.push("Write down one thing that surprised you."); }
    steps.push("Tap I'm done, and the next card appears.");
    return steps;
  }
  function labSteps(l) {
    return [
      "Start your labs and open the labs page, the way you set them up on the set-up card.",
      "Open Lab " + l[0] + ": " + l[1] + ".",
      "Your goal: " + l[3],
      "Start with what Episode " + l[4] + " showed. Change one thing at a time, and keep a note of what you typed and what came back.",
      "You are done when the lab says you solved it, or after 45 minutes of honest tries. Unsolved is normal: tick it and move on."
    ];
  }
  function writeupSteps(what) {
    return [
      "Open the write-up template on this card and copy it.",
      "Fill it in for " + what + ": the goal, your exact prompts, and what came back.",
      "Add a screenshot of the result.",
      "Save it in a folder on your computer called write-ups. You will put them online in step 6."
    ];
  }
  function graySwanSteps(title) {
    return [
      "Open the set and sign in to Gray Swan. An account is free.",
      "Read the goal of the first scenario before you type anything.",
      "Start with what worked in Microsoft's labs, then change one thing at a time.",
      "Work through the scenarios in order. Stop after about an hour, solved or not.",
      "You are done when you have tried every scenario in \"" + title + "\" at least once."
    ];
  }

  function buildSteps() {
    function video(n) {
      return item("v" + n, "video", "Episode " + n + ": " + VIDEOS[n - 1],
        n >= 8 ? "This one shows an automation tool. Watch it, install nothing." : "", URLS.ms,
        { play: playerUrl(n - 1), how: videoSteps(n) });
    }
    function lab(n) {
      var l = MS_LABS.filter(function (x) { return x[0] === n; })[0];
      return item("m" + n, "lab", "Microsoft lab " + n + ": " + l[1] + " (" + l[2] + ")",
        l[3] + " Goes with Episode " + l[4] + "." + (l[5] ? " " + l[5] : ""), URLS.msLabs, { skip: true, how: labSteps(l) });
    }
    function writeup(n, what) {
      return item("w" + n, "writeup", "Write-up " + n + ": " + what,
        "A write-up is the proof employers and bounty programs ask to see. One per kind of lab is enough.", "",
        { skip: n <= 4, how: writeupSteps(what) });
    }
    var setup = item("m0", "lab", "Set up Microsoft's labs on your computer",
      "These are the practice chatbots from the videos. They run on your own computer, not in a browser, and every message you send is billed to your own OpenAI key: about US$5 of credit should cover all 12 labs (an estimate). If you would rather not install or pay, skip the labs: Gray Swan in step 3 is free practice of the same kind.",
      URLS.msLabsSetup, { skip: true, how: [
        "Install Docker Desktop. It is free. Restart your computer if it asks.",
        "Make an account at platform.openai.com, add the smallest credit it allows (about US$5) and create an API key. Keep the key private: it is a password for your credit.",
        "On Microsoft's lab guide, press the green Code button, choose Download ZIP, and unzip it.",
        "Follow Getting Started in the guide, the part called \"Using Standard OpenAI API\": it tells you where your key goes and the one command that starts the labs. The first start is slow.",
        "Open the address the guide gives you. It starts with http://localhost:5000. You are done when you see the list of labs."
      ] });

    var step1 = [
      { label: "START HERE", items: [video(1), video(2)] },
      { label: "SET-UP, ONCE", items: [setup] },
      { label: "EPISODE 3", items: [video(3), lab(1), writeup(1, "your direct prompt injection (lab 1)")] },
      { label: "EPISODE 4", items: [video(4), lab(6), writeup(2, "your indirect prompt injection (lab 6)")] },
      { label: "EPISODE 5", items: [video(5), lab(2), writeup(3, "how you got the secret out (lab 2)")] },
      { label: "EPISODE 6", items: [video(6), lab(5), writeup(4, "your Crescendo attack (lab 5)"), lab(3), lab(4)] },
      { label: "EPISODE 7", items: [video(7), lab(7), lab(8), lab(11), lab(9), lab(12), lab(10)] },
      { label: "EPISODES 8 TO 10, WATCH ONLY", items: [video(8), video(9), video(10)] }
    ];

    var security = [item("s0", "learn", "Create your free Microsoft Learn profile",
      "Every Microsoft Learn module you finish from now on adds a badge to this profile. It is the page you will show employers.",
      URLS.learn, { how: [
        "Open Microsoft Learn and press Sign in at the top right.",
        "Sign in with a Microsoft account. An Outlook, Hotmail or Xbox account works, or make one for free.",
        "Open your profile and set the display name to one you are happy for an employer to see.",
        "You are done when your profile page opens. Stay signed in from now on, so each module counts."
      ] })];
    SECURITY.forEach(function (s, i) {
      security.push(item("s" + (i + 1), "learn", "AI security module " + (i + 1) + ": " + s[0],
        i === 0 ? "The attacks you just did by hand, explained in plain language, with a quiz." : i === 1 ? "The defences: what a company can put in an attacker's way." : "How a real red-team test is planned.",
        LEARN + s[2], { mins: s[1], how: LEARN_STEPS }));
    });

    var practice = GRAYSWAN.map(function (g, i) {
      return item("g" + (i + 1), "practice", "Gray Swan: " + g[0], g[2] + " Stop when your time is up, solved or not: unsolved is normal.",
        URLS.gs + g[1], { how: graySwanSteps(g[0]) });
    });
    practice.push(item("g9", "practice", "Gray Swan: a live prize contest if one is open, or your weakest set again",
      "A placing in a contest is proof you can show. Prize money goes mostly to top finishers.", URLS.gsChallenges, { how: [
        "Open the Challenges page and look for a contest marked open.",
        "Read its rules before you start, especially what you may share afterwards.",
        "If none is open, go back to the set you found hardest.",
        "You are done after one honest session of about an hour."
      ] }));
    practice.push(writeup(5, "your best Gray Swan result, if its rules allow sharing"));

    var python = PYTHON.map(function (p, i) {
      var steps = LEARN_STEPS.slice();
      steps.splice(1, 1, "Do the units in order, and type the code yourself instead of copying it.", "At the Exercise unit, press Launch the exercise and follow its instructions. It is a small project of your own.");
      if (i === 2) { steps.splice(1, 0, "This module installs Python and Visual Studio Code on your computer. Both are free."); }
      return item("py" + (i + 1), "learn", "Python module " + (i + 1) + ": " + p[0],
        i === 0 ? "You write your first lines of Python." : i === 2 ? "You install the free code editor you will use from here on." : "",
        LEARN + p[2], { mins: p[1], how: steps });
    });

    var auto = [
      item("a1", "auto", "Open Microsoft's attack notebooks in Visual Studio Code",
        "A notebook is a page that mixes notes with code you run one piece at a time. Microsoft wrote these to solve its own labs with its tool PyRIT.",
        URLS.msNotebooks, { how: [
          "In Visual Studio Code, choose File, then Open Folder, and pick the notebooks folder inside the labs you downloaded.",
          "Open the file named Lab 1 - Credential exfiltration.",
          "Visual Studio Code offers to install what notebooks need. Accept.",
          "Install Microsoft's tool PyRIT. The notebook does not say how: the install steps are on Microsoft's PyRIT site, microsoft.github.io/PyRIT.",
          "Read the comments in the notebook's code. They list 7 steps for connecting it to your running lab. Follow them.",
          "You are done when the first piece of code runs without a red error."
        ] }),
      item("a2", "auto", "Run the Lab 1 notebook from top to bottom",
        "You watch code do in seconds what you did by hand in lab 1.", URLS.msNotebooks, { how: [
          "Start your labs first, the same way as before.",
          "Run the notebook one piece at a time, top to bottom.",
          "Before each piece, read the note above it and say in your own words what it will do.",
          "You are done when the attack finishes and the notebook shows whether it worked."
        ] }),
      item("a3", "auto", "Run the Lab 5 notebook (Crescendo)",
        "The multi-turn attack from Episode 6, run automatically.", URLS.msNotebooks, { how: [
          "Open the file named Lab 5 - Crescendo and Inflation.",
          "Run it one piece at a time, reading each note first.",
          "Watch how the questions build up turn by turn.",
          "You are done when it finishes and shows the result."
        ] }),
      item("a4", "auto", "Change one thing in a notebook, run it again, and write up what happened",
        "Changing code and seeing what changes is how the Python you learned becomes a skill. This is your first automated attack of your own.", URLS.msNotebooks, { how: [
          "Pick one thing to change in the Lab 5 notebook, such as the goal or the number of turns.",
          "Change only that, and run the notebook again.",
          "Compare the result with the first run.",
          "Write it up with the template from the Menu: what you changed, and what happened."
        ] })
    ];

    var last = [
      item("p1", "proof", "Put your proof in one place",
        "An employer will not ask what you watched. They will ask what you can show.", URLS.learnTranscript, { how: [
          "On Microsoft Learn, open your profile, then Transcript, then press Share. It asks you to set an access code, then gives you a link and a transcript ID.",
          "Put your write-ups in a public GitHub repository. First remove anything a site's rules say to keep private.",
          "Add the GitHub link, and the transcript link with its ID and code, to your resume and your LinkedIn profile.",
          "You are done when a friend can open both from another device."
        ] }),
      item("b1", "bounty", "Read Mozilla 0DIN's rules fully. Note what pays and what does not.", "", URLS.odin, { how: [
        "Open the policy page and read it to the end.",
        "Write down which AI systems are in scope and which are not.",
        "Write down what a report must include."
      ] }),
      item("b2", "bounty", "Test 3 ideas, only inside 0DIN's rules. Save every prompt and result, and keep them private.", "", "", { how: [
        "Pick one technique that worked for you in the labs or on Gray Swan.",
        "Try it against a system that 0DIN lists as in scope, and nowhere else.",
        "Save every prompt and every answer. Share them with nobody.",
        "Do this for 3 ideas. Most will not work, and that is normal."
      ] }),
      item("b3", "bounty", "Decide honestly whether one is a real, new finding. If yes, send 0DIN the short summary it asks for.", "", URLS.odin, { how: [
        "Ask: does it work again when I repeat the same steps? Try it 3 times.",
        "Ask: is it new, or a well-known trick?",
        "If both are yes, send the short summary 0DIN asks for. If not, send nothing."
      ] }),
      item("b4", "bounty", "Apply to Anthropic's model safety bug bounty, using your write-ups and results.", "", URLS.anthropic, { how: [
        "Open the program page and read who it is for.",
        "Fill in the application, linking your write-ups and any Gray Swan or 0DIN result.",
        "Answer every question truthfully. They choose who gets in."
      ] })
    ];

    return [
      { title: "Step 1: Microsoft's videos, each with its lab",
        goal: "Watch an episode here in the app, then do Microsoft's own lab for it. Four short write-ups along the way.",
        why: "The basics from Microsoft's own AI red team, and the best-known name to put on a resume.",
        groups: step1 },
      { title: "Step 2: Microsoft Learn, AI security fundamentals",
        goal: "Three short Microsoft modules, about 2 hours in all, each with a quiz and a badge.",
        why: "The same ground in plain language, plus defences and how a real test is planned.",
        groups: [{ label: "", items: security }] },
      { title: "Step 3: Gray Swan, scored practice on chatbots and agents",
        goal: "Free scored practice in your browser, easiest set first. One set a sitting.",
        why: "Microsoft has no practice for attacking agents. Gray Swan does, keeps score, and runs contests sponsored by large AI labs.",
        groups: [{ label: "", items: practice }] },
      { title: "Step 4: Python, on Microsoft Learn",
        goal: "Eight short Microsoft modules, about 7 hours in all, each with a small project and a quiz.",
        why: "The engineer-level job ads ask for Python, and the tools that automate attacks need it. The beginner contract ads do not.",
        groups: [{ label: "", items: python }] },
      { title: "Step 5: automate an attack with Microsoft's PyRIT",
        goal: "Run Microsoft's own attack notebooks against your labs, then change one.",
        why: "This is what Episodes 8 to 10 showed, now in your hands.",
        groups: [{ label: "", items: auto }] },
      { title: "Step 6: proof and bounties",
        goal: "Gather what you can show, then try for a paid, credited finding. Only real findings that work every time.",
        why: "A paid or credited finding is the strongest proof there is.",
        groups: [{ label: "", items: last }] }
    ];
  }

  var STEPS = buildSteps();

  // ---------- reference content ----------
  var PLACES = [
    ["Microsoft AI Red Teaming 101, and its labs", URLS.ms, "VIDEO + LAB · STEP 1 · 10 EPISODES, 12 LABS",
      "From Microsoft's own AI red team. Episodes 1 to 7 teach the attacks and Episodes 8 to 10 show its automation tool, PyRIT. The labs are the practice chatbots shown in the videos. They are the one part of this path that is not free and not in a browser: Docker on your own computer, plus about US$5 of paid AI usage. They can be skipped."],
    ["Microsoft Learn", URLS.learn, "COURSES · STEPS 2 AND 4 · 11 MODULES, ABOUT 9 HOURS",
      "Microsoft's own free training site. Two courses from it are in this path: AI security fundamentals, and Get Started with Python Programming, parts 1 and 2. Each module ends in a quiz and adds a badge to a profile you can share."],
    ["Gray Swan Arena", URLS.gsTraining, "PRACTICE · STEP 3 · NOT MICROSOFT",
      "Scored practice against real AI models, free and in a browser, with beginner sets for chatbots and for agents. It is here because Microsoft has no practice for attacking agents. Prize contests come and go on the same site."],
    ["Mozilla 0DIN and Anthropic", URLS.odin, "BOUNTIES · STEP 6 · NOT MICROSOFT",
      "Two programs that pay for real findings. They are here because Microsoft runs no bounty a beginner can enter for this work."]
  ];
  var MONEY = [
    ["Hourly AI testing and rating platforms", "The quickest money when an application lands. Pay and acceptance vary a lot, and nobody can promise either."],
    ["Gray Swan prize contests", "Prize money goes mostly to top finishers. For a beginner the real payoff is a leaderboard placing you can show."],
    ["Bug bounties", "Mozilla 0DIN pays US$500 to US$15,000 for a new finding that works every time. Anthropic's program pays up to US$35,000, but you apply and they choose who gets in."],
    ["A job", "Salaried entry-level AI red-team jobs are rare: none was open when this was last checked. Public write-ups, contest results and basic Python are what a newcomer can show instead of experience."]
  ];
  var RULES = [
    "Only attack sites built for it, or programs that invite it in writing. Never test a company's live product outside its bounty rules.",
    "Weapons topics only inside an official lab or program that asks for that testing. Never anywhere else.",
    "A lab that runs on your own AI key falls under that provider's rules. If a lab asks for content the provider forbids, the risk to your account is yours.",
    "Check a site's sharing rules before posting a write-up. Live contests and bounties often require you to keep details private.",
    "Every write-up is your own real attempt. Never claim something you did not do."
  ];
  var TEMPLATE = "Target: (site and challenge name)\nGoal: (what the AI was not supposed to do)\nWhat I tried: (numbered steps, with the exact prompts)\nWhat happened: (the result, plus a screenshot)\nDoes it repeat: (worked __ of 3 tries)\nHow bad is it: (low, medium or high, and why)\nHow to fix it: (one suggestion)";

  // ---------- words: plain-English meanings. [word, where it comes up, meaning, box it is new at (only when the tag cannot say)] ----------
  // A tag is given only where a video, lab or module names the topic itself. VIDEO 3 -> box v3, LAB 2 -> box m2, MODULE 1 -> box s1.
  var WORDS = [
    ["The basics", [
      ["AI model (LLM)", "VIDEO 2", "A large language model: software trained on huge amounts of text that writes by predicting the next words. Chatbots are built on these."],
      ["Prompt", "VIDEO 2", "Whatever you type or send to the model."],
      ["AI application", "", "A product built around a model: the model plus hidden instructions, data, tools and filters. You attack the whole thing, not just the model."],
      ["System prompt (metaprompt)", "LAB 2", "Hidden instructions from the company that built the chatbot, telling the model how to behave. Users are not meant to see it. Microsoft calls it a metaprompt."],
      ["Context window", "", "Everything the model can see at one time: its hidden instructions, the chat so far, and any documents or tool results."],
      ["Guardrail", "VIDEO 7", "Any safety layer meant to stop bad behaviour: the model's training, its hidden instructions, or filters on what goes in and what comes out."],
      ["Content filter", "MODULE 2", "A separate check that blocks harmful text on its way into or out of a model."],
      ["Grounding", "MODULE 2", "Giving the model trusted documents to answer from, so it makes less up."],
      ["Refusal", "", "The model saying no. Most attacks are attempts to get past a refusal."],
      ["Hallucination", "", "The model stating something false as if it were true. A reliability problem, not an attack."],
      ["Overreliance", "MODULE 1", "People trusting an AI's answer without checking it."]
    ]],
    ["Attacks", [
      ["AI red teaming", "VIDEO 1", "Attacking an AI system on purpose, with permission, to find its weak points before real attackers do."],
      ["Jailbreak", "MODULE 1", "Getting a model to break its own safety rules, such as producing content it is trained to refuse."],
      ["Prompt injection", "VIDEO 3", "Slipping your own instructions into what the model reads, so it follows you instead of the company that built it."],
      ["Direct prompt injection", "VIDEO 3", "You type the attack yourself, straight into the chat."],
      ["Indirect prompt injection", "VIDEO 4", "The attack hides in something the AI reads later: a web page, an email, a document. The victim never types it."],
      ["System prompt leak", "LAB 2", "Tricking a chatbot into revealing its hidden instructions. Microsoft calls this metaprompt extraction."],
      ["Encoding trick", "LAB 2", "Hiding a request from filters by changing its form: another language, code words, scrambled spelling."],
      ["Role-play attack", "", "Asking the model to play a character or tell a story in which the forbidden answer seems allowed."],
      ["Refusal suppression", "", "Wording a request so the model is steered away from saying no, for example by telling it never to apologise or warn."],
      ["Single-turn attack", "VIDEO 5", "An attack that fits in one message."],
      ["Multi-turn attack", "VIDEO 6", "An attack spread over several messages, each step small enough to pass."],
      ["Crescendo", "VIDEO 6 · LAB 5", "A multi-turn attack that starts with harmless questions and pushes a little further each turn until the model goes along."],
      ["Many-shot jailbreak", "", "Packing one prompt with many made-up examples of the model answering forbidden questions, so it carries on the pattern."],
      ["Hidden text", "", "Instructions a person cannot see but the AI can: invisible characters, or text tucked inside an image."],
      ["Universal jailbreak", "STEP 6", "One method that works across many different forbidden requests, not just one. Anthropic's bounty asks for these.", "b4"]
    ]],
    ["Agents", [
      ["Agent", "GRAY SWAN", "An AI that takes actions, not just talks: it can browse, send email or run code by using tools.", "g3"],
      ["Tool call", "GRAY SWAN", "A tool is something the agent is allowed to use, such as search or send-email. A tool call is the agent using one.", "g3"],
      ["Agent hijack", "GRAY SWAN", "Taking control of what an agent does, usually through text it reads while working.", "g4"],
      ["Excessive agency", "", "An agent with more power or access than its job needs, so one trick does real damage. The fix is to give it only what it needs."],
      ["Data exfiltration", "MODULE 1", "Getting the AI to send private data somewhere it should not go."],
      ["RAG", "", "Retrieval-augmented generation: the AI looks things up in a store of documents and uses what it finds to answer."],
      ["Knowledge-base poisoning", "", "Planting a doctored document in that store, so the AI later repeats or obeys it."],
      ["MCP", "", "Model Context Protocol: a common standard for plugging tools and data into AI agents."],
      ["Tool poisoning", "", "Hiding instructions inside a tool's description, so the agent obeys them."],
      ["Memory poisoning", "", "Getting a false instruction saved in an agent's long-term memory, so it keeps acting on it later."],
      ["Unsafe output handling", "", "An app that trusts whatever the AI writes and runs or displays it without checking."]
    ]],
    ["The work", [
      ["Threat model", "", "A plain list of who might attack a system, what they want and how they could get it."],
      ["OWASP LLM Top 10", "", "A well-known public list of the ten most serious weaknesses in AI applications. Job ads and reports refer to it."],
      ["Write-up", "STEP 1", "A short report of one attack: the target, what you tried, what happened, how bad it is and how to fix it.", "w1"],
      ["PyRIT", "VIDEO 8", "Microsoft's free tool for running many attacks automatically. It needs Python."],
      ["Notebook", "STEP 5", "A page that mixes notes with code you run one piece at a time.", "a1"],
      ["Scope", "STEP 6", "What a program allows you to test. Anything outside scope is off limits.", "b1"],
      ["Reproducible", "STEP 6", "It works again when someone else follows your steps. Bounties pay only for this.", "b3"],
      ["Bug bounty", "STEP 6", "A program that pays outsiders for reporting real flaws.", "b1"],
      ["Attack success rate", "", "How often an attack works, such as 7 of 10 tries. Reports and tools use this number."],
      ["Responsible disclosure", "", "Reporting a flaw privately to the owner, and giving them time to fix it before saying anything in public."],
      ["CTF", "", "Capture the flag: a security game you win by reaching a hidden goal. Gray Swan's sets work this way."]
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
    ["Indeed Canada: AI red teaming, remote", "https://ca.indeed.com/jobs?q=AI+red+teaming&l=Remote"],
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
    "Microsoft's AI Red Teaming 101 series and its labs, done.",
    "A Microsoft Learn profile showing AI security fundamentals and Python, with a transcript you can share.",
    "A Gray Swan profile with solved sets, and any contest placing.",
    "4 to 6 write-ups of your own attacks.",
    "One automated attack run with Microsoft's PyRIT.",
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
  var AUDIT_DATE = "18 Nov 2026";
  var AUDIT = [
    ["ok", "Microsoft's series has 10 episodes; episodes 8 to 10 cover the PyRIT automation tool.", "Read on Microsoft's official training page."],
    ["ok", "The 10 episodes play inside the app.", "Each one uses the same player Microsoft's own training page uses for that episode (6 on Microsoft's player, 4 on YouTube). All 10 were played on the live site on 18 Nov 2026 in Chrome. If a video does not play, the card has a link to Microsoft's page."],
    ["ok", "Microsoft's labs are the ones shown in the videos, and each goes with an episode.", "Read on Microsoft's own GitHub page on 18 Nov 2026: 12 challenges from its red team, first taught at Black Hat USA 2024, each listed against an episode. All 12 are in this path, each placed after its episode."],
    ["ok", "Microsoft's labs are not free to run and not in a browser.", "Microsoft's page lists what they need: Docker, Python, and an OpenAI key or an Azure OpenAI endpoint. The lab code is free; the AI usage is billed to your own key."],
    ["ok", "Four labs have a goal an AI is meant to refuse.", "Labs 3, 9 and 10 ask for Molotov cocktail instructions and lab 4 for a toxin: Microsoft's page says so. The app marks them, and they can be skipped. They run on your own AI key, whose rules still apply."],
    ["no", "About US$5 covers all 12 labs.", "An estimate from OpenAI's price list on 18 Nov 2026 (under one US cent a message on the default model), not a measured cost. OpenAI shows the real minimum top-up before you pay."],
    ["no", "The labs run well on any computer.", "They start a dozen small programs at once. The author of this app has read Microsoft's instructions but has not run the labs."],
    ["ok", "Microsoft Learn training is free.", "Microsoft's own help page says: \"Microsoft Learn training is free and available to anyone\"."],
    ["ok", "AI security fundamentals is 3 beginner modules, about 2 hours, each with a quiz.", "Read from Microsoft's course list on 18 Nov 2026: 53, 48 and 29 minutes, level \"beginner\", each ending in a module assessment."],
    ["ok", "Microsoft's Python course is 8 beginner modules, about 7 hours, each with a small project and a quiz.", "Read from Microsoft's course list on 18 Nov 2026: Get Started with Python Programming, parts 1 and 2, 402 minutes in all, last updated 28 Oct 2026. The third module has you install Python and Visual Studio Code. Not checked: where the first two modules have you run your code."],
    ["ok", "Finishing a module adds a badge to your Microsoft Learn profile, and finishing a course adds a trophy.", "Microsoft's help page says both appear on your profile and can be shared. Its transcript page has a Share button that makes a link with an access code."],
    ["no", "These courses give you a Microsoft certificate.", "They give badges, trophies and a transcript. A Microsoft certification is a separate, paid exam and is not part of this path."],
    ["no", "Microsoft has practice for attacking AI agents.", "None was found: its labs cover chatbots and one practice web page. That is why Gray Swan is in the path."],
    ["ok", "Gray Swan has training sets that are open any time, for chatbots and for agents.", "Seen on its Training page in a signed-in free account on 18 Nov 2026: 3 beginner sets, 3 intermediate sets and 5 more. Every set in this path was opened."],
    ["ok", "Gray Swan runs contests sponsored by large AI labs.", "A US$300,000 contest in October 2026 was sponsored by Anthropic, Meta, Google DeepMind and Reflection AI (Fortune, Oct 2026)."],
    ["changed", "An earlier version used a 21-day course from SecurityElites as step 2.", "Removed on 18 Nov 2026. It is new, has no outside reviews, its author uses a pen name, and its labs could not be tested. Microsoft's labs and courses and Gray Swan's sets take its place."],
    ["changed", "An earlier version taught Python with freeCodeCamp.", "Changed on 18 Nov 2026 to Microsoft Learn's course, so the path stays with one organization. freeCodeCamp's course is free and well regarded; it was not dropped for quality."],
    ["changed", "An earlier version said Gray Swan posts new challenges every Wednesday.", "Not true now: that series is closed for judging and its sets live on the Training page. The claim was removed."],
    ["changed", "An earlier version said Gray Swan has paid out over US$1 million and brought 100 people into paid work.", "No source was found for those numbers, so they were removed."],
    ["ok", "Mozilla 0DIN pays US$500 to US$15,000 and asks for a short summary first.", "Read on 0DIN's policy page."],
    ["ok", "Anthropic's model safety bounty pays up to US$35,000, takes applications, and requires a confidentiality agreement.", "Read on Anthropic's help page."],
    ["no", "The notebooks in step 5 run as described.", "Read on 18 Nov 2026: each notebook is one note and three pieces of code, uses PyRIT, and Lab 1's note says to follow steps 1 to 7 in its comments. They do not say how to install PyRIT. The author of this app has not run them."],
    ["ok", "Engineer-level AI red-team job ads ask for Python.", "Several 2026 postings ask for Python or basic scripting. This is a sample of ads, not a survey. The beginner contract ads read for the Jobs tab did not ask for it."],
    ["changed", "An earlier version counted an entry-level salaried ad as open.", "That ad (10a Labs) was not on the company's own job board on 17 Nov 2026, so it counts as closed. No other entry-level salaried ad was found."],
    ["ok", "Every link in the app opens the right page.", "Opened on 18 Nov 2026: the Microsoft training page and lab pages, all 11 Microsoft Learn modules, the Gray Swan pages, the 0DIN and Anthropic pages, the job sites and the job searches."],
    ["ok", "The job titles, pay and asks on the Jobs tab come from real ads.", "Each ad was read on its own page on 17 Nov 2026. Pay is copied as the ad posted it. Ads close and pay changes, so they are examples, not offers."],
    ["ok", "An ad on the Jobs tab has a working link.", "A free automatic check opens every ad's page once a day. If the page is gone, leads somewhere else or says it is closed, the ad is hidden. Each ad shows the date its link was last checked. A site that blocks the check keeps its older date."],
    ["no", "A listed ad still has work to give.", "The link check only proves an ad is still posted. A talent pool can stay posted while no project is running."],
    ["no", "A posted hourly rate is what you would earn.", "A range in an ad is not an offer, and contract platforms do not guarantee hours."],
    ["no", "The Words tab is an official glossary.", "The meanings are plain-English summaries written for this app. A word is tagged only where a video, lab or module names the topic itself. Microsoft's material is the authority."],
    ["ok", "Linked devices store ticks and streak days only, under a private code that is never shown.", "Tested on 17 and 18 Nov 2026: reading the whole store, listing other people's codes, and saving anything except numbers were all refused."],
    ["ok", "The short code used to link a device works once and runs out in 10 minutes.", "Tested on 18 Nov 2026: a used code, a made-up code, a backdated code and a list of all codes were all refused."],
    ["no", "Finishing this path gets you hired.", "Nobody can promise that. The path builds the things a newcomer can show: Microsoft badges, write-ups, contest results and basic Python."]
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
  function link(text, url, cls, id) {
    return h("a", { href: url, target: "_blank", rel: "noopener", class: cls || "", id: id || null, text: text });
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
    // A change made here must beat what every device already knows, even if another device's clock runs fast.
    var now = Math.max(Date.now(), state.r + 1, Math.abs(state.m[it.id] || 0) + 1);
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
    // The clear must be newer than every tick it wipes, even one stamped by a device whose clock runs fast.
    var newest = state.r;
    Object.keys(state.m).forEach(function (id) { newest = Math.max(newest, Math.abs(state.m[id])); });
    Object.keys(state.y).forEach(function (k) { newest = Math.max(newest, state.y[k]); });
    state.m = {};
    state.y = {};
    state.best = 0;
    state.open = {};
    state.r = Math.max(Date.now(), newest + 1);
    save();
    if (state.sync) { sync.replace = true; sync.pending = {}; flushSoon(); }
  }

  // ---------- syncing between devices ----------
  // Each person has one private code, kept on their devices and never shown. The ticks for that code live at DB + code,
  // and every device holding it reads and writes the same spot. Only ticks, streak days and two numbers are stored there.
  // To link a second device, the first one asks for a short pairing code (8 characters, good for 10 minutes, used once)
  // that points at the private code. Typing the short code into the other device hands the private code over.
  var DB = "https://red-team-path-default-rtdb.firebaseio.com/sync/";
  var PAIR = "https://red-team-path-default-rtdb.firebaseio.com/pair/";
  var ABC = "abcdefghijkmnpqrstuvwxyz23456789"; // no l, o, 0 or 1: they are too easy to misread
  var sync = { status: "off", pending: {}, replace: false, union: false, busy: false, timer: 0, pullTimer: 0, retryTimer: 0, stream: null };
  var STATUS_TEXT = {
    off: "Not linked: saved on this device only",
    saving: "Linked · saving…",
    ok: "Linked · saved",
    offline: "No internet: saved here, will send later"
  };

  function randomText(n) {
    var bytes = new Uint8Array(n);
    window.crypto.getRandomValues(bytes);
    var out = "";
    for (var i = 0; i < bytes.length; i += 1) { out += ABC.charAt(bytes[i] % 32); }
    return out;
  }
  function findCode(text) {
    var m = /(?:^|[^a-z0-9])([a-z2-9]{32})(?![a-z0-9])/.exec(String(text || "").trim());
    return m ? m[1] : "";
  }
  // What someone typed, tidied: any case, spaces and dashes ignored, and a typed "1" or "l" read as the "i" it must be.
  function cleanPin(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9]/g, "").replace(/[1l]/g, "i");
  }
  function showPin(pin) { return (pin.slice(0, 4) + "-" + pin.slice(4)).toUpperCase(); }
  function setStatus(s) {
    sync.status = s;
    ["sync-line", "sync-status"].forEach(function (id) {
      var line = document.getElementById(id);
      if (line) { line.textContent = STATUS_TEXT[s]; line.setAttribute("data-sync", s); }
    });
    var btn = document.getElementById("menu-btn");
    if (btn) { btn.setAttribute("data-sync", s); }
  }
  function send(method, url, body) {
    var opts = { method: method };
    if (body !== undefined) { opts.body = JSON.stringify(body); }
    // Give up after 15 seconds, so one stuck request on a bad connection cannot block every later save.
    var stop = window.AbortController ? new window.AbortController() : null;
    var timer = 0;
    if (stop) { opts.signal = stop.signal; timer = window.setTimeout(function () { stop.abort(); }, 15000); }
    return window.fetch(url, opts).then(function (res) {
      window.clearTimeout(timer);
      if (!res.ok) { throw new Error("refused " + res.status); }
      return res.json();
    }, function (err) {
      window.clearTimeout(timer);
      throw err;
    });
  }
  function request(method, body) { return send(method, DB + state.sync + ".json", body); }
  function retryLater() {
    // After a failed save or fetch, try again by itself every 30 seconds until it works.
    window.clearTimeout(sync.retryTimer);
    sync.retryTimer = window.setTimeout(wake, 30000);
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
      retryLater();
    });
  }
  // Folds what the other devices saved into this device. Returns what this device has that the others lack.
  // union = true on the first fetch after this device is linked: then every tick on either side is kept.
  function mergeRemote(remote, union) {
    var changed = false;
    var rr = typeof remote.r === "number" ? remote.r : 0;
    var rm = remote.m && typeof remote.m === "object" ? remote.m : {};
    var ry = remote.y && typeof remote.y === "object" ? remote.y : {};
    if (union) {
      // Stamp every tick, from both sides, as newer than any earlier untick or "clear all" on either side.
      var top = Math.max(state.r, rr);
      Object.keys(rm).forEach(function (id) {
        if (KNOWN[id] && typeof rm[id] === "number" && rm[id] > 0 && !(state.m[id] > 0)) { state.m[id] = rm[id]; }
      });
      Object.keys(state.m).forEach(function (id) {
        if (!(state.m[id] > 0)) { delete state.m[id]; return; }
        var other = typeof rm[id] === "number" ? Math.abs(rm[id]) : 0;
        state.m[id] = Math.max(state.m[id], rm[id] > 0 ? other : other + 1, top + 1);
      });
      Object.keys(ry).forEach(function (k) {
        if (DAY_RE.test(k) && typeof ry[k] === "number" && !state.y[k]) { state.y[k] = ry[k]; }
      });
      Object.keys(state.y).forEach(function (k) { state.y[k] = Math.max(state.y[k], top + 1); });
      if (typeof remote.b === "number" && remote.b > state.best) { state.best = remote.b; }
      state.r = top;
      changed = true;
      if (rr < top) { return { replace: true, changed: true, change: {} }; } // the other side's "clear all" is older: write the merged ticks whole
    } else if (rr > state.r) {
      // Another device cleared all ticks after this device last heard from it.
      Object.keys(state.m).forEach(function (id) { if (Math.abs(state.m[id]) <= rr) { delete state.m[id]; } });
      Object.keys(state.y).forEach(function (k) { if (state.y[k] <= rr) { delete state.y[k]; } });
      state.best = 0;
      state.r = rr;
      changed = true;
    }
    if (rr < state.r) { return { replace: true, changed: changed, change: {} }; } // this device cleared more recently
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
      var out = mergeRemote(remote && typeof remote === "object" ? remote : {}, sync.union);
      sync.union = false;
      save();
      if (out.replace) { sync.replace = true; sync.pending = {}; }
      else { Object.keys(out.change).forEach(function (k) { if (!(k in sync.pending)) { sync.pending[k] = out.change[k]; } }); }
      if (sync.replace || Object.keys(sync.pending).length) { flush(); } else if (!sync.busy) { setStatus("ok"); }
      if (out.changed) { render(); }
    }, function () { setStatus("offline"); retryLater(); });
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
  // joining = true when this device is being linked to ticks that already exist somewhere else.
  function startSync(code, joining) {
    state.sync = code;
    sync.pending = {};
    sync.replace = false;
    sync.union = !!joining;
    save();
    setStatus("saving");
    pull();
    listen();
  }
  function stopSync() {
    state.sync = "";
    sync.pending = {};
    sync.replace = false;
    sync.union = false;
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
  // Asks the store for a short code that points at this device's private code. done(pin), or done("") if it failed.
  function makePin(done, tries) {
    var pin = randomText(8);
    send("PUT", PAIR + pin + ".json", { c: state.sync, t: { ".sv": "timestamp" } }).then(function () { done(pin); }, function (err) {
      // "refused" means that code is already in use by someone else: pick another. Anything else is the internet.
      if (tries > 1 && /^refused/.test(String(err && err.message))) { makePin(done, tries - 1); } else { done(""); }
    });
  }
  // Links this device using a short code typed by the person. done("ok"), done("wrong") or done("offline").
  function usePin(text, done) {
    var pin = cleanPin(text);
    if (pin.length !== 8) { done("wrong"); return; }
    send("GET", PAIR + pin + ".json").then(function (got) {
      if (!got || !SYNC_RE.test(String(got.c || ""))) { done("wrong"); return; }
      startSync(got.c, true);
      send("DELETE", PAIR + pin + ".json").then(function () {}, function () {}); // a code works once
      done("ok");
    }, function (err) { done(/^refused/.test(String(err && err.message)) ? "wrong" : "offline"); });
  }

  // ---------- words that belong to a lesson ----------
  // A word is "new" at the first box its tag names (VIDEO 3 -> v3, LAB 2 -> m2, MODULE 1 -> s1), or at the box the word itself names.
  var WORDS_AT = {};
  WORDS.forEach(function (g) {
    g[1].forEach(function (w) {
      var m = /^(VIDEO|LAB|MODULE) (\d+)/.exec(w[1]);
      var id = w[3] || (m ? (m[1] === "VIDEO" ? "v" : m[1] === "LAB" ? "m" : "s") + m[2] : "");
      if (!id) { return; }
      (WORDS_AT[id] = WORDS_AT[id] || []).push(w);
    });
  });

  // ---------- Now tab: one thing at a time ----------
  var OPEN_LABEL = { video: "Open the video", lab: "Open Microsoft's lab guide", learn: "Open it on Microsoft Learn", practice: "Open the practice",
    auto: "Open Microsoft's notebooks", proof: "Open Microsoft Learn", bounty: "Open the page" };
  var lastDone = null; // the box ticked most recently on this screen, so one tap can undo it
  var tickedAt = 0;    // a fast double tap must not tick two boxes
  var pairNote = "";   // one line shown in the menu right after this device is linked
  var playing = "";    // the box whose video is open in the player, so a re-draw does not restart it

  function tagFor(entry) {
    var it = entry.it;
    var parts = [];
    if (entry.label) { parts.push(entry.label); }
    parts.push(KIND[it.kind]);
    if (it.mins) { parts.push("ABOUT " + it.mins + " MIN"); }
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
  function howFold(steps) {
    var list = h("ol", { class: "steps" });
    steps.forEach(function (s) { list.appendChild(h("li", { text: s })); });
    return h("details", { class: "fold", id: "how-fold" }, [h("summary", { text: "How to do this: " + steps.length + " steps" }), list]);
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
    // A video is playing and it is still the next thing to do: leave the screen alone, or the video would start over.
    if (playing && idx !== -1 && SEQ[idx].it.id === playing && document.getElementById("player")) { return; }
    playing = "";
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
    // Videos play right here in the card. Everything else opens its own site.
    // Microsoft's player hands over to a second Microsoft address, so the frame's permissions are given to any address (*).
    var watch = null;
    if (it.play) {
      watch = h("div", { class: "player-box", id: "player-box" });
      var watchBtn = h("button", { type: "button", class: "big open", id: "watch-btn", text: "▶ Watch it here" });
      watchBtn.addEventListener("click", function () {
        playing = it.id;
        watch.textContent = "";
        watch.appendChild(h("iframe", { id: "player", src: it.play, title: it.title, allowfullscreen: "",
          allow: "autoplay *; encrypted-media *; picture-in-picture *; fullscreen *", referrerpolicy: "strict-origin-when-cross-origin" }));
        watch.appendChild(h("p", { class: "linkline" }, ["Not playing? ", link("Open it on Microsoft's page ↗", it.url, "", "player-fallback")]));
      });
      watch.appendChild(watchBtn);
    }
    doneBtn.addEventListener("click", function () {
      playing = "";
      tickedAt = Date.now();
      lastDone = it;
      setDone(it, true);
      render("now-title");
    });

    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> " + step.title.toUpperCase() }),
      h("h1", { id: "now-title", tabindex: "-1", text: "Do this now" }),
      idx === 0 ? h("p", { class: "lede", text: "One fixed path: " + STEPS.length + " steps, " + SEQ.length + " boxes. Everything is free except Microsoft's labs (about US$5 of AI usage), which you can skip. Do the card below, then tap I'm done. The next one appears." }) : null,
      stepStart && idx !== 0 ? h("p", { class: "lede", text: step.goal }) : null
    ]));
    v.appendChild(h("div", { class: "card now", id: "now-card", "data-id": it.id }, [
      h("div", { class: "tag", text: tagFor(entry) }),
      h("div", { class: "title", text: it.title }),
      why ? h("div", { class: "why" }, [h("b", { text: "WHY " }), why]) : null,
      it.how ? howFold(it.how) : null,
      words ? wordsFold(words) : null,
      it.kind === "writeup" ? templateFold() : null,
      watch || (it.url ? link(OPEN_LABEL[it.kind] + " ↗", it.url, "big open") : null),
      doneBtn
    ]));
    // Microsoft's labs cost money and need installing, so one tap can skip the whole set.
    var skip = null;
    if (it.skip) {
      var skipBtn = h("button", { type: "button", class: "ghost", id: "skip-labs", text: "SKIP MICROSOFT'S LABS" });
      skipBtn.addEventListener("click", function () {
        lastDone = null;
        SEQ.forEach(function (e) { if (e.it.skip && !isDone(e.it.id)) { setDone(e.it, true); } });
        render("now-title");
      });
      skip = h("p", { class: "linkline" }, ["Not installing or paying for these? ", skipBtn]);
    }
    var after = idx + 1 < SEQ.length ? SEQ[idx + 1].it.title : "that was the last box.";
    v.appendChild(h("div", { class: "block" }, [
      h("p", { class: "after", id: "after-line" }, [h("b", { text: "AFTER THIS " }), after]),
      skip,
      undo,
      !state.sync ? h("p", { class: "linkline", id: "link-line" }, [
        "Use this on your phone or computer too? ",
        h("a", { href: "#menu", id: "link-go", text: "Link a device" })
      ]) : null
    ]));
  }

  // ---------- Path tab: the whole list ----------
  function renderPath(idx) {
    var v = document.getElementById("view-path");
    v.textContent = "";
    var here = idx === -1 ? null : SEQ[idx];
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> PATH" }),
      h("h1", { text: "The whole path, top to bottom" }),
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
            if (box.checked) { setDone(it, true); render(id); return; }
            // Removing a tick asks first: a stray tap on a phone should not undo work.
            box.checked = true;
            var row = box.parentNode;
            if (row.querySelector(".confirm")) { return; }
            var yes = h("button", { type: "button", id: "untick-" + it.id, text: "Untick" });
            var no = h("button", { type: "button", id: "keep-" + it.id, text: "Keep" });
            var ask = h("div", { class: "confirm", role: "group", "aria-label": "Untick this box?" }, [h("span", { class: "status-line", text: "Untick this box?" }), yes, no]);
            yes.addEventListener("click", function () {
              if (lastDone && lastDone.id === it.id) { lastDone = null; }
              setDone(it, false);
              render(id);
            });
            no.addEventListener("click", function () { row.removeChild(ask); box.focus({ preventScroll: true }); });
            row.appendChild(ask);
            no.focus({ preventScroll: true });
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
      h("p", { class: "lede", text: "Real ads with real links. Pay is copied as each ad posted it: an example, not a promise. An automatic check opens every ad once a day: each ad shows when its link was last checked, and is hidden once the link dies." })
    ]));

    var startBlock = h("div", { class: "block", id: "jobs-start" }, [
      h("h2", { text: "Open now for beginners" }),
      h("p", { class: "lede", text: "You can apply once you have a couple of lab write-ups. Gray Swan results raise your odds." })
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
    box.appendChild(h("h2", { text: "Link my devices" }));
    box.appendChild(h("p", { class: "status-line", id: "sync-status", role: "status", "data-sync": sync.status, text: STATUS_TEXT[sync.status] }));
    if (pairNote) { box.appendChild(h("p", { class: "ticked", id: "pair-note", role: "status", text: pairNote })); pairNote = ""; }

    var pinShow = h("div", { class: "pin", id: "pair-show", hidden: "" });
    var getBtn = h("button", { type: "button", class: "primary", id: "link-start", text: state.sync ? "Get a code for another device" : "Get a code for my other device" });
    var getStatus = h("span", { class: "status-line", role: "status", id: "link-status" });
    getBtn.addEventListener("click", function () {
      if (!state.sync) { startSync(randomText(32)); render(); syncPanel(); }
      var show = document.getElementById("pair-show");
      var status = document.getElementById("link-status");
      status.textContent = "Getting a code…";
      makePin(function (pin) {
        if (!pin) { status.textContent = "Could not get a code. Check the internet and try again."; return; }
        status.textContent = "";
        show.textContent = "";
        show.appendChild(h("div", { class: "pin-code", id: "pair-code", text: showPin(pin) }));
        show.appendChild(h("p", { text: "Open this app on your other device. Tap MENU, type this code where it says \"I have a code\", and tap Link." }));
        show.appendChild(h("p", { class: "dim", text: "The code works once and runs out in 10 minutes." }));
        show.hidden = false;
        // After 10 minutes the code no longer works, so stop showing it.
        window.setTimeout(function () {
          var shown = document.getElementById("pair-code");
          if (shown && shown.textContent === showPin(pin)) { document.getElementById("pair-show").hidden = true; }
        }, 600000);
      }, 4);
    });

    var pairStatus = h("span", { class: "status-line", role: "status", id: "pair-status" });
    var pairBox = h("input", { type: "text", id: "pair-box", "aria-label": "Code from your other device", placeholder: "XXXX-XXXX", autocomplete: "off", autocapitalize: "characters", autocorrect: "off", spellcheck: "false", maxlength: "12" });
    var pairBtn = h("button", { type: "button", id: "pair-btn", text: "Link" });
    function link() {
      document.getElementById("pair-status").textContent = "Linking…";
      usePin(pairBox.value, function (result) {
        if (result === "ok") {
          pairNote = "Linked. Ticks from both devices are being combined.";
          render();
          syncPanel();
          return;
        }
        document.getElementById("pair-status").textContent = result === "wrong"
          ? "That code is not right, or it has run out. Get a new code on the other device and try again."
          : "Could not reach the internet. Check the connection and try again.";
      });
    }
    pairBtn.addEventListener("click", link);
    pairBox.addEventListener("keydown", function (e) { if (e.key === "Enter") { link(); } });

    if (!state.sync) {
      box.appendChild(h("p", { text: "See the same ticks on your phone and your computer, and keep a safe copy if this one is ever cleared. No account, no password, no links to open." }));
    }
    box.appendChild(h("div", { class: "btnrow" }, [getBtn, getStatus]));
    box.appendChild(pinShow);
    box.appendChild(h("p", { class: "dim", id: "pair-label", text: "I have a code from my other device:" }));
    box.appendChild(pairBox);
    box.appendChild(h("div", { class: "btnrow" }, [pairBtn, pairStatus]));
    if (state.sync) {
      box.appendChild(h("p", { class: "note", text: "What is stored online: which boxes are ticked and on which days. No name, no email, nothing else about you." }));
      var offBtn = h("button", { type: "button", class: "ghost", id: "sync-off", text: "UNLINK THIS DEVICE" });
      offBtn.addEventListener("click", function () { stopSync(); render(); syncPanel(); });
      box.appendChild(h("div", { class: "btnrow" }, [offBtn]));
    }
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
      h("span", { class: "status-line", text: state.sync ? "Clear every tick and the streak, on every linked device?" : "Clear every tick and the streak?" }), clearYes, clearNo]);
    clearAsk.addEventListener("click", function () { confirmRow.hidden = false; clearAsk.hidden = true; });
    clearNo.addEventListener("click", function () { confirmRow.hidden = true; clearAsk.hidden = false; });
    clearYes.addEventListener("click", function () { lastDone = null; clearAll(); render(); });

    box.appendChild(h("h2", { text: "Settings" }));
    box.appendChild(h("div", { class: "btnrow" }, [themeBtn]));
    box.appendChild(h("p", { id: "streak-line", text: "Streak: " + run + (run === 1 ? " day" : " days") + " in a row with at least one box ticked. Best run: " + state.best + "." }));
    box.appendChild(h("details", { class: "fold", id: "backup-fold", open: foldOpen ? "" : null }, [
      h("summary", { text: "Backup code (works without linking devices)" }),
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
    [["Link devices", "menu-sync"], ["Settings", "menu-settings"], ["Where you learn", "menu-places"], ["Rules", "menu-rules"], ["Template", "menu-template"], ["Audit", "menu-audit"]].forEach(function (j) {
      var b = h("button", { type: "button", text: j[0] });
      b.addEventListener("click", function () { document.getElementById(j[1]).scrollIntoView({ block: "start" }); });
      jump.appendChild(b);
    });
    v.appendChild(h("div", { class: "block" }, [
      h("div", { class: "eyebrow", text: "> MENU" }),
      h("h1", { text: "Link devices, settings and info" }),
      jump
    ]));
    v.appendChild(h("div", { class: "block panel", id: "menu-sync" }));
    v.appendChild(h("div", { class: "block panel", id: "menu-settings" }));

    var rows = h("div", { class: "rows" });
    PLACES.forEach(function (p) {
      rows.appendChild(h("div", { class: "row" }, [h("div", null, [link(p[0], p[1])]), h("div", { class: "meta", text: p[2] }), h("p", { text: p[3] })]));
    });
    v.appendChild(h("div", { class: "block", id: "menu-places" }, [
      h("h2", { text: "Where you learn, and why" }),
      h("p", { class: "lede", text: "One main name, Microsoft, so you can say where you studied. Two named extras cover what Microsoft does not offer. Everything is free and in a web browser except Microsoft's labs. The list changes only when a fact changes, and the audit below says what changed." }),
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
    // An older version linked devices with a long link (…#sync=code). Such a link still works: it joins that code,
    // keeping every tick, then removes the code from the address bar.
    var m = /^#sync=(.*)$/.exec(window.location.hash || "");
    if (!m) { return false; }
    var code = findCode(m[1]);
    window.history.replaceState(null, "", "#menu");
    if (code) { startSync(code, true); }
    return true;
  }

  window.addEventListener("hashchange", function () {
    if (takeLink()) { render(); syncPanel(); }
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
