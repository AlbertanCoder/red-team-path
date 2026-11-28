"""Public job feeds that a script may read: the job boards companies publish for exactly this purpose.
Used by tools/find_jobs.py (weekly: look for new ads) and tools/check_jobs.py (daily: is an ad still posted?).

Three kinds of board publish a feed with no sign-in:
  ashby       https://api.ashbyhq.com/posting-api/job-board/<board>
  greenhouse  https://boards-api.greenhouse.io/v1/boards/<board>/jobs
  lever       https://api.lever.co/v0/postings/<board>?mode=json
"""
import json
import re
import urllib.error
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept": "application/json,text/html"}

# (kind, board name in the address, name shown in the app). Every board here answered on 19 Nov 2026.
# Contract and gig platforms come first, because their ads are the ones a beginner can apply to.
BOARDS = [
    ("ashby", "handshake", "Handshake"),
    ("ashby", "Clera", "Clera"),
    ("ashby", "mercor", "Mercor"),
    ("greenhouse", "invisibletech", "Invisible"),
    ("greenhouse", "turing", "Turing"),
    ("greenhouse", "labelbox", "Labelbox (Alignerr)"),
    ("greenhouse", "scaleai", "Scale AI"),
    ("greenhouse", "remotasks", "Remotasks"),
    ("greenhouse", "toloka", "Toloka"),
    ("greenhouse", "prolific", "Prolific"),
    ("lever", "appen", "Appen"),
    ("ashby", "cohere", "Cohere"),
    ("greenhouse", "anthropic", "Anthropic"),
    ("ashby", "openai", "OpenAI"),
    ("greenhouse", "xai", "xAI"),
    ("greenhouse", "togetherai", "Together AI"),
    ("greenhouse", "snorkelai", "Snorkel AI"),
    ("ashby", "far.ai", "FAR.AI"),
    ("ashby", "irregular", "Irregular"),
    ("greenhouse", "hiddenlayer", "HiddenLayer"),
    ("greenhouse", "bugcrowd", "Bugcrowd"),
    # Added 23 Nov 2026: companies that sell AI red teaming or test AI for governments. Every one answered that day.
    ("ashby", "Gray%20Swan%20AI", "Gray Swan"),
    ("ashby", "trajectory-labs", "Trajectory Labs"),
    ("greenhouse", "haizelabs", "Haize Labs"),
    ("ashby", "hackerone", "HackerOne"),
    ("ashby", "afterquery", "AfterQuery"),
    ("greenhouse", "10alabs", "10a Labs"),
    ("greenhouse", "aisi", "UK AI Security Institute"),
    ("ashby", "faculty", "Faculty"),
    ("lever", "apolloresearch", "Apollo Research"),
    ("lever", "metr", "METR"),
    ("ashby", "redwoodresearch", "Redwood Research"),
]

# A title must match this to be listed. Narrow on purpose: better to miss an ad than to list the wrong kind of job.
WANT = re.compile(r"red[\s-]?team|jailbreak|adversarial|prompt[\s-]injection|safety test|ai safety (?:tester|evaluator|associate|specialist)"
                  r"|safety (?:evaluat|red)|model (?:safety|evaluation) (?:tester|associate|specialist)", re.I)
# Words that mark an ad as asking for experience. Such ads are listed after the others.
SENIOR = re.compile(r"senior|staff|principal|lead\b|manager|director|head of|scientist|engineer|expert|5\+", re.I)


def get_json(url):
    """Returns (status code or 0, parsed JSON or None)."""
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            return r.status, json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as err:
        return err.code, None
    except Exception:
        return 0, None


def text(value, key=None):
    """A feed field as plain text, whatever shape it came in: a string, a number, or an object holding the string under key."""
    if key and isinstance(value, dict):
        value = value.get(key)
    if isinstance(value, (str, int, float)) and not isinstance(value, bool):
        return str(value).strip()
    return ""


def feed(kind, board):
    """Open jobs on one board as a list of {title, url, where, pay}, or None when the feed could not be read."""
    if kind == "ashby":
        code, data = get_json("https://api.ashbyhq.com/posting-api/job-board/%s?includeCompensation=true" % board)
        if code != 200 or not isinstance(data, dict) or "jobs" not in data:
            return None
        out = []
        for j in data["jobs"]:
            if not isinstance(j, dict):
                continue
            comp = j.get("compensation") if isinstance(j.get("compensation"), dict) else {}
            out.append({"title": text(j.get("title")), "url": text(j.get("jobUrl")), "where": text(j.get("location")),
                        "pay": text(comp.get("compensationTierSummary")) or text(comp.get("scrapeableCompensationSalarySummary"))})
        return out
    if kind == "greenhouse":
        code, data = get_json("https://boards-api.greenhouse.io/v1/boards/%s/jobs" % board)
        if code != 200 or not isinstance(data, dict) or "jobs" not in data:
            return None
        return [{"title": text(j.get("title")), "url": text(j.get("absolute_url")), "where": text(j.get("location"), "name"), "pay": ""}
                for j in data["jobs"] if isinstance(j, dict)]
    if kind == "lever":
        code, data = get_json("https://api.lever.co/v0/postings/%s?mode=json" % board)
        if code != 200 or not isinstance(data, list):
            return None
        return [{"title": text(j.get("text")), "url": text(j.get("hostedUrl")), "where": text(j.get("categories"), "location"), "pay": ""}
                for j in data if isinstance(j, dict)]
    return None
