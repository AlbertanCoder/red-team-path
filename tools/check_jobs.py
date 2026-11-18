"""Link check for the job ads on the Jobs tab (run from the repo root: python tools/check_jobs.py).

Reads jobs.js, opens every ad's link, and rewrites jobs.js:
  - an ad whose page is gone, redirects away, or says it is closed is marked  "open": false  (the app hides it)
  - an ad that is confirmed still up gets today's date in "checked"
  - an ad that could not be reached today (site blocked the check, timeout) is left exactly as it was
It can only tell that an ad is still posted. It cannot tell whether a talent pool has work right now.

Pass --dry to print the result without writing the file.
"""
import datetime
import html
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILE = ROOT / "jobs.js"
HEAD = ("// Job ads for the Jobs tab. tools/check_jobs.py re-checks every link and rewrites this file,\n"
        "// so edit it by hand only to add or remove an ad. Everything after the equals sign is plain JSON.\n"
        "window.RTP_JOBS = ")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept": "text/html,application/json"}
CLOSED = re.compile(r"(?i)no longer (?:accepting|available|open)|position (?:has been |is )?(?:filled|closed)"
                    r"|job (?:not found|has expired|is closed|is no longer)|posting (?:has |is )?(?:closed|expired)|this job has expired")


def load():
    text = FILE.read_text(encoding="utf-8")
    start = text.index("window.RTP_JOBS = ") + len("window.RTP_JOBS = ")
    return json.loads(text[start:].rstrip().rstrip(";"))


def dump(data):
    return HEAD + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"


def get(url):
    """Returns (status code or 0, final address, page text)."""
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30)
        return r.status, r.geturl(), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as err:
        return err.code, url, ""
    except Exception:
        return 0, url, ""


def plain(body):
    body = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", body)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", body)))


BOARDS = {}


def check_ashby(ad):
    """Ashby job boards publish a feed of open jobs. Match by title, because a reposted ad gets a new link."""
    board = ad["check"]["board"]
    if board not in BOARDS:
        code, _, body = get("https://api.ashbyhq.com/posting-api/job-board/" + board)
        try:
            BOARDS[board] = json.loads(body)["jobs"] if code == 200 else None
        except (ValueError, KeyError):
            BOARDS[board] = None
    jobs = BOARDS[board]
    if jobs is None:
        return "unknown", "could not read the %s job board" % board
    for job in jobs:
        if job.get("title", "").strip() == ad["check"]["title"]:
            ad["url"] = job["jobUrl"]
            return "open", "listed on the %s job board" % board
    return "closed", "no longer listed on the %s job board" % board


def check_page(ad):
    code, final, body = get(ad["url"])
    if code in (404, 410):
        return "closed", "page answered %d" % code
    if code != 200:
        return "unknown", "page answered %d" % code
    want_host = re.sub(r"^https?://([^/]+).*", r"\1", ad["url"])
    if want_host not in final:
        return "closed", "link now leads to %s" % final[:60]
    text = plain(body) + " " + html.unescape(" ".join(re.findall(r"(?is)<title[^>]*>(.*?)</title>", body)))
    hit = CLOSED.search(text)
    if hit:
        return "closed", "page says: %s" % hit.group(0)
    missing = [m for m in ad["check"]["must"] if m.lower() not in text.lower()]
    if missing:
        return "unknown", "page is up but does not show: %s" % ", ".join(missing)
    return "open", "page is up and shows the job title"


def main():
    dry = "--dry" in sys.argv
    today = datetime.date.today().isoformat()
    data = load()
    counts = {"open": 0, "closed": 0, "unknown": 0}
    for ad in data["ads"]:
        result, why = (check_ashby if ad["check"]["type"] == "ashby" else check_page)(ad)
        counts[result] += 1
        if result == "open":
            ad["open"] = True
            ad["checked"] = today
            ad.pop("closed", None)
        elif result == "closed":
            if ad.get("open", True):
                ad["closed"] = today
            ad["open"] = False
        print("%-8s %-28s %s" % (result, ad["id"], why))
    if counts["open"] or counts["closed"]:
        data["updated"] = today  # the date at the top of the Jobs tab moves only when at least one ad was really checked
    print("open=%(open)d closed=%(closed)d unknown=%(unknown)d" % counts)
    if not dry:
        FILE.write_text(dump(data), encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
