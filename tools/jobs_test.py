"""Checks the job tools' own rules without going online. Run: python tools/jobs_test.py   (tools/ship.sh runs it before every publish)
  1. canada_from: how a posted location becomes a Canada tag (yes / anywhere / check / no). Unclear places must be "check", never hidden.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from find_jobs import canada_from  # noqa: E402

CASES = [
    ("Remote - US or Canada", "yes"), ("United States or Canada", "yes"), ("Canada", "yes"), ("Remote - CAN", "yes"), ("Edmonton, AB", "yes"),
    ("Hybrid - Vancouver", "check"), ("Toronto or Remote US", "check"), ("Montréal, QC", "check"), ("Waterloo, ON", "check"),
    ("North America", "check"), ("Remote (Americas)", "check"), ("Remote", "check"), ("", "check"), ("San Francisco; Remote", "check"),
    ("Remote (International)", "anywhere"), ("Global Remote", "anywhere"), ("Worldwide", "anywhere"),
    ("Remote, Worldwide (except Canada)", "no"), ("Remote - Anywhere in the US", "no"), ("Remote (US only)", "no"), ("Remote (USA)", "no"),
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
print("%d FAILED" % fails if fails else "ALL PASSED (%d cases)" % len(CASES))
sys.exit(1 if fails else 0)
