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
    ("ashby", "patronus", "Patronus AI"),
    ("greenhouse", "hiddenlayer", "HiddenLayer"),
    ("greenhouse", "bugcrowd", "Bugcrowd"),
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


def feed(kind, board):
    """Open jobs on one board as a list of {title, url, where, pay}, or None when the feed could not be read."""
    if kind == "ashby":
        code, data = get_json("https://api.ashbyhq.com/posting-api/job-board/%s?includeCompensation=true" % board)
        if code != 200 or not isinstance(data, dict) or "jobs" not in data:
            return None
        out = []
        for j in data["jobs"]:
            comp = j.get("compensation") or {}
            out.append({"title": (j.get("title") or "").strip(), "url": j.get("jobUrl") or "", "where": (j.get("location") or "").strip(),
                        "pay": (comp.get("compensationTierSummary") or comp.get("scrapeableCompensationSalarySummary") or "").strip()})
        return out
    if kind == "greenhouse":
        code, data = get_json("https://boards-api.greenhouse.io/v1/boards/%s/jobs" % board)
        if code != 200 or not isinstance(data, dict) or "jobs" not in data:
            return None
        return [{"title": (j.get("title") or "").strip(), "url": j.get("absolute_url") or "", "where": ((j.get("location") or {}).get("name") or "").strip(), "pay": ""}
                for j in data["jobs"]]
    if kind == "lever":
        code, data = get_json("https://api.lever.co/v0/postings/%s?mode=json" % board)
        if code != 200 or not isinstance(data, list):
            return None
        return [{"title": (j.get("text") or "").strip(), "url": j.get("hostedUrl") or "", "where": ((j.get("categories") or {}).get("location") or "").strip(), "pay": ""}
                for j in data]
    return None
