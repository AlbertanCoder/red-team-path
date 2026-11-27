# IDEAS: the parking lot

New ideas that are not on the approved plan go here, one line each. Nothing here gets built until Shad picks it as a new scope.

- (2026-11-19, Claude) The link check script written for the audit could run once a week on GitHub and report dead links in the app's learning material, the same way the job check runs daily.
- (2026-11-19, Claude) A person reads each ad the weekly scan finds and moves the good ones to "Open now for beginners" with pay and what it asks for.
- (2026-11-19, Claude) Try the app on a physical iPhone and Android phone and fix whatever only shows there.
- (2026-11-19, Claude) Notes do not follow a linked device (the online store only takes numbers). Syncing them would need a different store.
- (2026-11-19, Claude) Lab 10: a time-boxed attempt at getting past its "I cannot help" rule with a harmless goal, to learn whether the route on its page works.
- (2026-11-19, Claude) Bring `~/redteam/learn/final_audit.py` up to date with the rebuilt app, or retire it in favour of `tools/app_test.py`.

- (2026-11-27, Claude) A daily GitHub job could open Shad's public proof links that the app cannot read itself (freeCodeCamp's public profile shows `isPythonCertV9`; HackerOne and Bugcrowd profiles) and mark them confirmed, the way the job check works.
- (2026-11-27, Claude) Teach the app to keep ticks with ids it does not know yet (instead of dropping them), so a device on an older version can never lose newer ticks.

## Parked track: "Robot Brains: Embodied AI Red Teaming" (Shad, 27 Nov 2026)

Parked, not built: ~/scope-hq/ACTIVE.md still lists an open scope, and Shad chose to finish the AI red teaming path first and build this when he has more time and usage. When he asks for it: write SCOPE.md for it and wait for "I agree".

Shad's request, as he gave it:
- **Goal**: how humanoid and industrial robots work from the motors up to the AI "brain", how to probe and test them, and how they fail. Be the person who understands, tests and keeps robots safe on jobsites in 5 to 10 years. Use his construction background.
- **Rules**: free resources only, every link checked before it goes in. Same lab format as the app (objective, how to think about it, up to 3 tap-to-reveal hints, answer only after an attempt). Videos and labs in a fixed order, one step at a time, with real examples. Attacks only in simulators, on his own hardware (Raspberry Pi), or in programs that invite testing; never on real products. Each module ends with a write-up: Target, Rule I tried to break, Steps, Result, Reproduced x3, Severity, Suggested fix.
- **Modules, in order**: (1) the robot stack: sensors, actuators, compute, power, how a humanoid like Optimus is put together; (2) low level: just enough C/C++ and Linux to read robot firmware and drivers, hands-on with his Raspberry Pi; (3) ROS 2: nodes, topics, messages, labs in a free simulator; (4) robot brains: imitation learning and vision-language-action models, hands-on with free open-source tools (e.g. Hugging Face LeRobot); (5) seeing inside the brain: beginner AI interpretability, what we can and can't know about why a model acts; (6) robot red teaming: prompt injection into LLM-controlled robots, fooling robot vision, breaking safety rules in simulation, mapped to the OWASP LLM Top 10, with published research as case studies; (7) safety and standards: industrial and collaborative robot safety standards, emergency stops, how robots on a construction site should be fenced, supervised and tested; (8) capstone: a full red-team report on a simulated robot, added to his portfolio.
- **Done** = the track shows in the app with all 8 modules in order, every link checked, at least modules 1 and 2 with complete labs, committed and pushed, commit hash shown to him.

Claude's notes for when it is built (leads only, none checked yet):
- Fits after Step 11 (agents) and Step 12 (his own tool): the same skills (prompt injection, tool use, threat models, GitHub proof) carry over to LLM-controlled robots.
- Leads to check: ROS 2's own tutorials (docs.ros.org); a free simulator (Gazebo); Hugging Face LeRobot; published research on jailbreaking LLM-controlled robots (for example "RoboPAIR", 2024) as module 6 case studies; free interpretability teaching material for module 5.
- The main robot safety standards (ISO 10218, ISO/TS 15066) are sold, not free: module 7 would need free official summaries instead (for example OSHA's material on robotics). Check what is free before promising it.
- His Raspberry Pi from the noise logger build could serve module 2, once that project no longer needs it.
