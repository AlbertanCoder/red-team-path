"""Weekly scan for NEW job ads (run from the repo root: python tools/find_jobs.py). Pass --dry to print without writing.

Reads the public job feeds listed in tools/job_feeds.py and looks for titles like "red team", "jailbreak",
"adversarial" and "safety testing". Each match that is not already in jobs.js is added with  "level": "new".
The app shows those under "Found by the weekly scan", marked as not yet read by a person.

What it copies: the title, the company, the link, the location and the pay, and the last two only when the feed states them.
What it cannot do: judge whether an ad suits a beginner, or whether there is work behind it. A person has to open the ad.
The daily check (tools/check_jobs.py) hides an ad once it leaves its board.
"""
import datetime
import re
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from check_jobs import FILE, dump, load  # noqa: E402
from job_feeds import BOARDS, SENIOR, WANT, feed  # noqa: E402

MAX_NEW = 12  # at most this many scan-found ads are listed at a time, so the screen stays short


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60]


def main():
    dry = "--dry" in sys.argv
    today = datetime.date.today().isoformat()
    data = load()
    ads = data["ads"]
    have_urls = {a["url"] for a in ads}
    have_keys = {(a["who"].split(",")[0].strip().lower(), a["title"].strip().lower()) for a in ads}
    ids = {a["id"] for a in ads}
    room = MAX_NEW - sum(1 for a in ads if a.get("level") == "new" and a.get("open", True))
    found, read = [], 0
    for kind, board, name in BOARDS:
        jobs = feed(kind, board)
        if jobs is None:
            print("could not read  %-22s (%s)" % (name, kind))
            continue
        read += 1
        hits = [j for j in jobs if WANT.search(j["title"]) and j["url"].startswith("https://")]
        print("read            %-22s %4d open jobs, %d with a matching title" % (name, len(jobs), len(hits)))
        for j in hits:
            key = (name.split(" (")[0].lower(), j["title"].lower())
            if j["url"] in have_urls or key in have_keys:
                continue
            have_urls.add(j["url"])
            have_keys.add(key)
            found.append((kind, board, name, j))
    # ads that do not ask for seniority in the title come first; the order of the boards breaks ties
    found.sort(key=lambda f: 1 if SENIOR.search(f[3]["title"]) else 0)
    added = 0
    for kind, board, name, j in found:
        if added >= room:
            break
        ad_id = slug(name + " " + j["title"])
        while ad_id in ids:
            ad_id += "-2"
        ids.add(ad_id)
        ads.append({
            "id": ad_id,
            "level": "new",
            "title": j["title"],
            "who": name,
            "pay": j["pay"] or "Pay not stated in the job feed",
            "ask": "Found by the weekly scan. Nobody has read this ad for you yet: open it and judge it yourself."
                   + (" Location as posted: %s." % j["where"] if j["where"] else ""),
            "url": j["url"],
            "check": {"type": "feed", "kind": kind, "board": board, "title": j["title"]},
            "added": today,
            "found": today,
            "checked": today,
            "open": True,
        })
        added += 1
        print("NEW             %-22s %s" % (name, j["title"]))
    if read:
        data["scanned"] = today
        data["boards"] = read
    left = len(found) - added
    print("boards read=%d of %d  new ads added=%d%s" % (read, len(BOARDS), added, "  (left out, list is full: %d)" % left if left > 0 else ""))
    if not dry:
        FILE.write_text(dump(data), encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
