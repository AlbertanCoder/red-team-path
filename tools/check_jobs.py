"""Link check for the job ads on the Jobs tab (run from the repo root: python tools/check_jobs.py).

Reads jobs.js, checks every ad (its page, or its company's public job feed), and rewrites jobs.js:
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

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import job_feeds  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILE = ROOT / "jobs.js"
HEAD = ("// Job ads for the Jobs tab. tools/check_jobs.py re-checks every link and rewrites this file,\n"
        "// so edit it by hand only to add or remove an ad. Everything after the equals sign is plain JSON.\n"
        "window.RTP_JOBS = ")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept": "text/html,application/json"}
# "no longer accepting applicants from California" and "once a position is filled" are not closed ads.
# Nor are "until the position is filled" and "closed to non-US residents".
CLOSED = re.compile(r"(?i)no longer (?:accepting (?:applications|applicants)(?! from| in| for)|available|open)"
                    r"|(?<!once )(?<!once a )(?<!once the )(?<!until )(?<!until a )(?<!until the )(?<!when )(?<!when a )(?<!when the )"
                    r"(?<!after )(?<!after a )(?<!after the )(?<!this )(?:this )?position (?:has been |is now |is )?(?:filled|closed(?! to\b))"
                    r"|job (?:not found|has expired|is closed|is no longer|expired)|posting (?:has |is )?(?:closed|expired)|this job has expired"
                    r"|applications (?:are|have) (?:now )?closed")


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


FEEDS = {}


def check_feed(ad):
    """Job boards publish a feed of their open jobs. Match by title, because a reposted ad gets a new link.
    Ads added by hand say  "type": "ashby", "board": ...   Ads found by the weekly scan say  "type": "feed", "kind": ..., "board": ..."""
    kind = ad["check"].get("kind", "ashby")
    board = ad["check"]["board"]
    if (kind, board) not in FEEDS:
        FEEDS[(kind, board)] = job_feeds.feed(kind, board)
    jobs = FEEDS[(kind, board)]
    if jobs is None:
        return "unknown", "could not read the %s job board" % board
    for job in jobs:
        if same_title(job["title"], ad["check"]["title"]):
            if job["url"]:
                ad["url"] = job["url"]
            return "open", "listed on the %s job board" % board
    return "closed", "no longer listed on the %s job board" % board


def same_title(a, b):
    """A title edited a little (capitals, spaces, dashes, brackets) is the same ad."""
    norm = lambda t: re.sub(r"[^a-z0-9]+", " ", str(t).lower()).strip()
    return norm(a) == norm(b)


def host(url):
    return re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", url).lower()


def check_page(ad):
    code, final, body = get(ad["url"])
    if code in (404, 410):
        return "closed", "page answered %d" % code
    if code != 200:
        return "unknown", "page answered %d" % code
    if host(ad["url"]) != host(final):  # a move from www. to the bare address is the same site
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
    shown = {}  # link -> id of the first ad still open with that link
    for ad in data["ads"]:
        try:
            result, why = (check_feed if ad["check"]["type"] in ("ashby", "feed") else check_page)(ad)
        except Exception as err:  # an ad or a feed in a shape nobody expected: leave that ad as it was, check the rest
            result, why = "unknown", "could not be checked (%s)" % type(err).__name__
        if result != "closed" and ad.get("url") in shown:  # an old ad came back after the weekly scan had added the job again
            result, why = "closed", "same job as %s" % shown[ad["url"]]
        counts[result] += 1
        if result == "open":
            ad["open"] = True
            ad["checked"] = today
            ad.pop("closed", None)
            if ad.get("canada") not in ("yes", "anywhere", "check", "no") or not ad.get("where"):  # closed before ads had Canada tags, now back
                ad["canada"] = "check"
                ad["where"] = "This ad was closed and has come back: read it to see whether it can be done from Canada."
        elif result == "closed":
            if ad.get("open", True):
                ad["closed"] = today
            ad["open"] = False
        if ad.get("open", True) and ad.get("url"):
            shown.setdefault(ad["url"], ad["id"])
        print("%-8s %-28s %s" % (result, ad["id"], why))
    if counts["open"] or counts["closed"]:
        data["updated"] = today  # the date at the top of the Jobs tab moves only when at least one ad was really checked
    print("open=%(open)d closed=%(closed)d unknown=%(unknown)d" % counts)
    if not dry:
        FILE.write_text(dump(data), encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
