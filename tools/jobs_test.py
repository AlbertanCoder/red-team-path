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
print("%d FAILED" % fails if fails else "ALL PASSED (%d cases)" % len(CASES))
sys.exit(1 if fails else 0)
