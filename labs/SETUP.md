# Setting up Microsoft's AI red teaming labs on Windows

These are the 12 practice chatbots shown in Microsoft's AI Red Teaming 101 videos. Microsoft publishes them at
[github.com/microsoft/AI-Red-Teaming-Playground-Labs](https://github.com/microsoft/AI-Red-Teaming-Playground-Labs).

This guide is what actually worked on one Windows 11 laptop on 18 Nov 2026. Microsoft's own instructions are the
authority; this page adds the steps and the one fix they leave out.

## What you need to know first

- **They run on your own computer**, inside a free program called Docker Desktop. They are not a website.
- **They cost a little.** The lab files are free, but every message you send in a lab is billed to your own OpenAI
  account. About US$5 of credit should cover all 12 labs. That figure is an estimate, not a measurement.
  OpenAI's smallest purchase is US$5 (its form starts at US$10), and it turns **auto-reload** on by default: switch it
  off when you buy credit, or it buys more by itself when the balance runs low.
- **Microsoft's files do not build as shipped.** One step asks a retired download address for an update and stops with
  "404 Not Found". A fix was proposed to Microsoft and closed without being merged (pull request 69). Step 3 below
  is the fix. (Microsoft's open issue 33 is a different build failure.)
- **The labs' AI model is being retired.** They use OpenAI's GPT-4o, and OpenAI shuts it down on 14 Jan 2027 (its
  deprecations page, read 27 Nov 2026). See "When OpenAI retires GPT-4o" below.
- **You can skip all of this.** In the Red Team Path app, tap "Skip Microsoft's labs". Gray Swan in step 3 of the path is
  free practice of the same kind, in a browser.

## Steps

### 1. Install Docker Desktop

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/) and open the installer.
2. Choose **Per-user installation** and **WSL 2**.
3. When it is installed, open Docker Desktop from the Start menu and accept its terms.
4. It asks whether this is for work or personal use: choose **Personal**. It also offers a sign-in: you can **skip** it.
5. Wait until the bottom-left corner says **Engine running**.

### 2. Get Microsoft's labs

1. On Microsoft's labs page, press the green **Code** button and choose **Download ZIP**.
2. Unzip it, and move the folder so that it is exactly `C:\Users\<your name>\ms-airt-labs`.
   Inside it you should see a file called `docker-compose-openai.yaml`.

### 3. Apply the fix

1. Download [`Dockerfile.fixed`](Dockerfile.fixed) from this folder.
2. In the labs folder, open `docker\chat-copilot\webapi`.
3. Replace the file called `Dockerfile` there with the one you downloaded, and rename it to `Dockerfile`.

What changed: two places are marked `LOCAL FIX` inside the file. One removes a request for a tool the image already
has. The other points an old Debian release at its archived download addresses. The second change is taken from a fix
that was proposed to Microsoft and closed without being merged (pull request 69).

### 4. Make your settings file

1. Download [`env.example`](env.example) from this folder into the labs folder, and rename it to `.env`.
2. Make an account at [platform.openai.com](https://platform.openai.com), add the smallest credit it allows (US$5),
   switch off **auto-reload** on that screen (OpenAI turns it on by default), and create an API key. The key is shown once. It is a password for your credit: never share it or paste it into a chat.
3. Open `.env` in Notepad. Put your key where it says `PASTE_YOUR_KEY_HERE`.
4. Replace the two `REPLACE_WITH...` values with long random letters and numbers of your own. Save.

### 5. Build the labs, once

1. Open the labs folder, click the address bar, type `cmd` and press Enter.
2. Paste this and press Enter:

```
docker compose -f docker-compose-openai.yaml build
```

It took about 10 minutes in total on the test laptop and works the computer hard: the processor reached 94 °C, so
the build there was slowed down and done in turns. If it stops with "404 Not Found", step 3 was missed.

### 6. Start a lab

1. Download [`Start labs.cmd`](Start%20labs.cmd) and [`Stop labs.cmd`](Stop%20labs.cmd) from this folder onto your Desktop.
2. Double-click **Start labs** and press Enter. All twelve labs start together (about 80 MB of memory each), so you can move between labs on the labs page. To start only one lab, type its number first. It never stops a lab that is already running.
3. The labs page opens in your browser. Press **Launch** next to your lab.
4. The lab says "Loading your challenge" for a few seconds. If it never gets past that, your OpenAI key is missing,
   wrong or out of credit.

### 7. Stop

**First download the chat of any lab you won** (the chat list on the left of the lab, then the download button). Stopping
the labs deletes every lab chat: the chats live inside the lab's containers, and stopping removes those. The Red Team
Path app needs the downloaded file as proof that you beat a lab.

Then double-click **Stop labs**. To free the most memory, also quit Docker Desktop: right-click the
whale icon near the clock and choose Quit.

## What was tested, and what was not

Tested on 18 Nov 2026, Windows 11, Docker Desktop 4.99:

- Both pieces built with the fix. Without the fix the build stopped at "404 Not Found".
- The labs page started, refused a visitor without the sign-in key, and listed all 12 labs.
- A lab started and used about 50 MB of memory while idle.
- With no OpenAI key in the settings file, a lab stayed on "Loading your challenge", and its log said the key was wrong.

- With a working OpenAI key, lab 1 answered five chat messages in 2 to 3.5 seconds each.

Not tested: the other 11 labs one by one (they run the same program), and the real cost of doing all 12.

## Four labs have a touchy goal

Labs 3, 9 and 10 ask the chatbot for Molotov cocktail instructions, and lab 4 for a toxin. That is Microsoft's design:
they teach how guardrails are bypassed. They run on your own OpenAI key. OpenAI's usage policies say that "breaking
or circumventing our rules and safeguards may mean you lose access to our systems" (read 27 Nov 2026). Lab 5 teaches
the same attack with a harmless goal, so the four can be skipped.

## When OpenAI retires GPT-4o (14 Jan 2027)

From that day a lab stays on "Loading your challenge" or answers with an error. To carry on:

1. Open `.env` in the labs folder in Notepad.
2. Change the line `OPENAI_TEXT_MODEL=gpt-4o` so that it names the model OpenAI lists as the replacement (on 27 Nov 2026
   its deprecations page names `gpt-6-luna`). Save.
3. Double-click **Stop labs**, then **Start labs**.

This was not tested: no lab has been run on a newer model. The answers on the app's lab pages were won on GPT-4o, and a
newer model may need different wording.

## On a Mac or Linux

Follow Microsoft's own Getting Started section, and apply the same fix from step 3. The two `.cmd` files are for Windows
only; Microsoft's page gives the commands to start and stop by hand.
