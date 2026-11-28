"""Checks the job tools' own rules without going online. Run: python tools/jobs_test.py   (tools/ship.sh runs it before every publish)
  1. canada_from: how a posted location becomes a Canada tag (yes / anywhere / check / no). Unclear places must be "check", never hidden.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from find_jobs import canada_from  # noqa: E402

CASES = [
    ("Remote - US or Canada", "yes"), ("United States or Canada", "yes"), ("Canada", "yes"), ("Remote - CAN", "yes"), ("Edmonton, AB", "check"),
    ("Edmonton", "check"), ("Moncton, New Brunswick", "check"), ("Saskatoon", "check"), ("Ontario", "check"), ("British Columbia", "check"),
    ("Hybrid - Vancouver", "check"), ("Toronto or Remote US", "check"), ("Montréal, QC", "check"), ("Waterloo, ON", "check"),
    ("North America", "check"), ("Remote (Americas)", "check"), ("Remote", "check"), ("", "check"), ("San Francisco; Remote", "check"),
    ("Remote (International)", "anywhere"), ("Global Remote", "anywhere"), ("Worldwide", "anywhere"),
    ("Remote, Worldwide (except Canada)", "no"), ("Remote (Canada excluded)", "no"), ("Remote - not available in Canada", "no"),
    ("Worldwide, excl. Canada", "no"), ("Remote, no Canada", "no"), ("Remote - Anywhere in the US", "no"), ("Remote (US only)", "no"), ("Remote (USA)", "no"),
    ("Remote - US", "no"), ("San Francisco, CA", "no"), ("London, UK", "no"), ("EMEA", "no"), ("Washington DC", "no"),
    ("New York City, NY (Hybrid); San Francisco, CA (Hybrid); United States (Remote)", "no"),
]
fails = 0
for where, want in CASES:
    got = canada_from(where)
    ok = got.get("canada") == want and bool(got.get("where"))
    print(("ok   " if ok else "FAIL ") + "%-40r -> %s (want %s)" % (where, got.get("canada"), want))
    fails += not ok

# 2. room_left: hidden ads (canada "no") must not fill the weekly scan's list of 12.
from find_jobs import MAX_NEW, room_left  # noqa: E402
hidden = [{"level": "new", "open": True, "canada": "no"} for _ in range(11)]
shown = [{"level": "new", "open": True, "canada": "anywhere"}, {"level": "new", "open": True}]
closed = [{"level": "new", "open": False, "canada": "yes"}]
for what, ads, want in [("11 hidden US/UK ads leave the list empty", hidden, MAX_NEW),
                        ("2 shown ads take 2 places", hidden + shown, MAX_NEW - 2),
                        ("a closed ad takes no place", shown + closed, MAX_NEW - 2)]:
    got = room_left(ads)
    print(("ok   " if got == want else "FAIL ") + "%s: room %d (want %d)" % (what, got, want))
    fails += got != want
    CASES.append(what)

# 3. jobs.js itself: every open ad says whether it can be done from Canada, and how that is known.
from check_jobs import load  # noqa: E402
untagged = [a["id"] for a in load()["ads"] if a.get("open", True) and (a.get("canada") not in ("yes", "anywhere", "check", "no") or not a.get("where"))]
print(("ok   " if not untagged else "FAIL ") + "every open ad in jobs.js has a Canada tag and a where line" + ("" if not untagged else ": missing on " + ", ".join(untagged)))
fails += bool(untagged)
CASES.append("tags")
# 4. Scope 3, fix 21 (audit D3): the tools around the ads. Each case is one the audit broke or found wrong.
import check_jobs  # noqa: E402
import find_jobs  # noqa: E402
import job_feeds  # noqa: E402


def case(what, ok):
    global fails
    print(("ok   " if ok else "FAIL ") + what)
    fails += not ok
    CASES.append(what)


boards = {b for _, b, _ in job_feeds.BOARDS}
case("the two feeds that belong to other companies (cais, patronus) are gone", not ({"cais", "patronus"} & boards))
for text, closed in (("We are no longer accepting applications.", True), ("This position has been filled.", True), ("This job has expired", True),
                     ("We are no longer accepting applicants from California.", False), ("Apply now: the ad comes down once a position is filled.", False),
                     # After-fixes audit, finding 3:
                     ("Applications will be reviewed on a rolling basis until the position is filled.", False),
                     ("We review applications until this position is filled.", False), ("This position is closed to non-US residents.", False),
                     ("Position filled", True), ("Applications are closed", True), ("Job expired", True)):
    case("the daily check reads %r as %s" % (text, "closed" if closed else "open"), bool(check_jobs.CLOSED.search(text)) == closed)
case("a move from www. to the bare address is the same site", check_jobs.host("https://www.example.com/jobs/1") == check_jobs.host("https://example.com/jobs/1"))
case("a title edited a little is the same ad", check_jobs.same_title("AI Red Teamer - Contract", "AI red teamer (contract)") and not check_jobs.same_title("AI Red Teamer", "Data Annotator"))
case("an odd feed shape gives plain text, not a crash", job_feeds.text({"name": "Remote"}, "name") == "Remote" and job_feeds.text(None) == "" and job_feeds.text(42) == "42")
case("an ad that asks for a fee or a chat app is never listed", bool(find_jobs.SCAM.search("Pay a $50 starter-kit fee by Telegram")) and not find_jobs.SCAM.search("AI Red Teamer $40 to $60 an hour"))
saved = (check_jobs.load, check_jobs.check_page, sys.argv)
calls = []


def fake_page(ad):
    calls.append(ad["id"])
    if ad["id"] == "bad":
        raise ValueError("a page in a shape nobody expected")
    return "open", "fine"


# "back" was closed before ads had Canada tags, then came back (as Clera's did on 28 Nov 2026).
fake = {"ads": [{"id": "bad", "check": {"type": "page"}, "url": "https://a.example"}, {"id": "good", "check": {"type": "page"}, "url": "https://b.example"},
                {"id": "back", "check": {"type": "page"}, "url": "https://c.example", "open": False, "closed": "2026-11-20"},
                {"id": "twin", "check": {"type": "page"}, "url": "https://b.example", "canada": "check", "where": "x"}]}
check_jobs.load = lambda: fake
check_jobs.check_page = fake_page
sys.argv = ["check_jobs.py", "--dry"]
try:
    check_jobs.main()
    went_on = calls == ["bad", "good", "back", "twin"]
except Exception:
    went_on = False
finally:
    check_jobs.load, check_jobs.check_page, sys.argv = saved
case("one ad that cannot be checked does not stop the daily check: the next ad is still checked", went_on)
back = fake["ads"][2]
case("an ad that comes back with no Canada tag is shown as check first, with a where line",
     back.get("open") is True and back.get("canada") == "check" and bool(back.get("where")))
case("two ads with the same link are not both shown: the later one is closed, the first stays open",
     fake["ads"][1].get("open") is True and fake["ads"][3].get("open") is False)
jobs = check_jobs.load()["ads"]
uk = [a for a in jobs if a["id"] == "uk-ai-security-institute-research-residency-red-team"]
case("the UK residency closes 13 December", bool(uk) and "13 December" in uk[0]["ask"])
print("%d FAILED" % fails if fails else "ALL PASSED (%d cases)" % len(CASES))
sys.exit(1 if fails else 0)
