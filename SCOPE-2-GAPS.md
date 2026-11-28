# Scope 2 gap check (27 Nov 2026)

Gaps between what Red Team Path teaches today (Steps 1-6) and what real AI bug bounty programs, contract red-team platforms open to Canada, and junior AI security ads ask for. Each page below was opened on 27 Nov 2026. Nothing in the app has changed.

## What the app covers today

Prompt injection (direct and indirect), single-turn and multi-turn jailbreaks, defences (Microsoft's 10 videos and 12 labs); Microsoft Learn AI security (3 modules); Gray Swan scored practice on chatbots and agents; beginner Python (8 Microsoft Learn modules); running Microsoft's PyRIT notebooks; optional write-ups; a Microsoft Learn transcript and a GitHub repo of write-ups; Mozilla 0DIN and Anthropic's bounty application.

## The biggest finding

**The big bounty programs do not pay for jailbreaks. They pay for attacks with a security impact, mostly through agents.** The app's bounty step aims at jailbreak-style findings.
- OpenAI Safety Bug Bounty (openai.com/index/safety-bug-bounty, launched 25 Mar 2026, runs on Bugcrowd): "jailbreaks are out of scope"; in scope: agent hijacking by third-party prompt injection and data exfiltration, including MCP.
- Google AI Vulnerability Reward Program (bughunters.google.com, AI VRP rules): jailbreaks and guardrail bypasses in your own session are out of scope; paid: "rogue actions" and "sensitive data exfiltration" caused by indirect prompt injection.
- Microsoft Copilot bounty (microsoft.com/en-us/msrc/bounty-ai): US$100 to US$30,000; "qualifying reports must demonstrate a qualifying security impact"; the report must include the conversation ID in its "Steps to reproduce".
- Mozilla 0DIN (0din.ai/policy, updated 2 Oct 2026) is the exception: it pays for jailbreaks, US$500 to US$15,000 by severity, and is open to Canada (only people on US sanctions lists are excluded).

## Gaps your 7 answers already put in the plan

| Gap | Who asks for it |
|---|---|
| Python to a working level, and reading code | Handshake AI Red Teamer, Cybersecurity: "read, write, and evaluate code ... Python, PowerShell, Bash"; Trajectory Labs AI Cyber Red Teamer; 10a Labs AI Red Teamer, Cyber |
| Calling AI models from Python (APIs, JSON) | Handshake AI Red Teamer; Anthropic Red Team Engineer, Safeguards |
| How models work: tokens, RAG, agents, tool use | Vettedlance AI Red-Teamer; Syntony Trusted Red Team Network; FAR.AI Jailbreaking Lead |
| Web security: how sites and APIs get hacked | Google AI VRP and Microsoft Copilot bounty (security impact needed); FAR.AI ad (HTTP and web) |
| OWASP Top 10 for LLM applications (2025 list, still current) | Clera Safety Testing Associate: "Burp Suite, Garak, PyRIT ... or the OWASP LLM Top 10 is helpful" ($30-60/h, fully remote) |
| Linux basics | Handshake (Bash), Trajectory Labs, 10a Labs |
| Git and GitHub | Syntony |
| Reports that get paid | Microsoft (steps to reproduce, conversation ID); 0DIN (reward depends on report quality); 9 of 13 ads mention reports or write-ups |

## New gaps (not covered by your answers)

1. **Agent attacks with real impact**: indirect prompt injection that makes an agent leak data or take an action. This is what OpenAI, Google and Microsoft pay for (above). Free practice: PortSwigger's Web LLM attacks labs (portswigger.net/web-security/llm-attacks), Gray Swan's agent sets (already in Step 3).
2. **Public proof with a score on it**: Syntony says its network holds "top 5 performers in Gray Swan Arena competitions and top performers on HackerOne and Hack The Box"; Trajectory Labs lists "successful jailbreaks of frontier models" as essential and bug bounty or CTF results as highly valued. The app has a GitHub repo and a Microsoft transcript, but no bounty-platform profile and no CTF record.
3. **How contract platforms vet people**: micro1 starts with an AI interview; Vettedlance has a 20-minute interview in English; Alignerr has a "quick screening process"; Claru needs a profile.
4. **Program rules, safe harbor and NDAs**: Syntony: "Engagements run under NDA"; Anthropic's bounty needs a confidentiality agreement; disclose.io explains safe harbor (legal cover for good-faith testing inside a program's rules).
5. **Getting paid from US platforms, and taxes in Canada**: Bugcrowd and HackerOne need a W-8BEN tax form (and HackerOne an identity check) before paying; Vettedlance pays weekly in USD; Canada: no GST/HST registration needed while you stay at or under $30,000 over four calendar quarters (canada.ca, "When to register for and start charging the GST/HST"); contract income is reported as business income (CRA form T2125: page did not load by script, to confirm).
6. **A résumé and LinkedIn that say only true things**: every contract ad asks for background and experience in the application form.
7. **Threat modelling**: named in 4 of 13 ads (Handshake, Syntony, Alignerr Coding, FAR.AI).

## Not open to you (noted for Jobs, not the curriculum)

Handshake AI's red-team ads are US only. 10a Labs' ads are US only or for US students.

## Step 5 check (PyRIT)

- github.com/Azure/PyRIT: archived 27 Mar 2026, read-only. The app links github.com/microsoft/PyRIT (live) and microsoft.github.io/PyRIT (loads).
- **Problem:** Microsoft's lab notebooks import `pyrit.orchestrator`. PyRIT's latest version is 1.2.1 (16 Nov 2026, needs Python 3.11 or newer), and `pyrit/orchestrator` no longer exists in PyRIT's code. So "install PyRIT" as Step 5 says will most likely break the notebooks; an older PyRIT version would be needed. Not run yet: to prove before any fix.

## Courses re-checked

- freeCodeCamp Python Certification (python-v9): 17 modules, then Python Review and the exam; 21 lectures, 20 workshops, 22 labs, 12 quizzes; "Complete the five required projects to qualify for the certification exam." Matches.
- Harvard CS50P: free; free CS50 Certificate at 70% or more on every problem and the final project.
- Candidates opened: PortSwigger Web Security Academy (free), OWASP LLM Top 10 2025, Microsoft Generative AI for Beginners (21 lessons) and AI Agents for Beginners (18 lessons), Hugging Face LLM course (free, no certificate), OverTheWire Bandit ("aimed at absolute beginners"), Hacker101 (free, by HackerOne), Bugcrowd University, NVIDIA garak (free). GitHub Skills now redirects to GitHub Learn. Python Institute PCEP: price not on its page.

## Shad's picks (27 Nov 2026, one question at a time)

1. Agent attacks with real impact: **its own step**, after web security (PortSwigger's AI agent labs, then Gray Swan's agent sets aimed at leaking data).
2. Public proof: **a HackerOne and Bugcrowd profile**, and **a CTF / lab record** (PortSwigger, Hacker101 CTF). Not a Gray Swan ranking target.
3. Getting paid: **platform screening practice**, **rules, safe harbor and NDAs**, **US pay and Canadian tax**. Not a résumé and LinkedIn box.
4. Threat modelling: **one short box** (one free reading, then a one-page threat model of a real AI agent he tests, saved as proof).
5. Step 5 (PyRIT): **prove it, then fix**: run the Lab 1 notebook on his PC with the newest PyRIT; if it fails, change only Step 5's install line to name the version that works. Ids and ticks untouched.

## Job ads read

13 ads read in full on 27 Nov 2026 (Alignerr x2, Claru, Vettedlance, Trajectory Labs, Syntony, Handshake x2, Clera, FAR.AI, Anthropic, 10a Labs, micro1 page too short to read). Counts: jailbreaks 11, prompt injection 9, reports or write-ups 9, code or scripting 9, security background 7, ML basics 7, agents 6, public proof 6, Python 4, APIs 4, CTF 4, bug bounty 4, threat modelling 4, Linux 3.
