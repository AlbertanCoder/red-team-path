"""Checks the live online store's rules with a throwaway code (deleted at the end). Run: python tools/store_rules_test.py
Honest writes, shaped exactly like the app's, must be accepted; junk must be refused. Shad's answer to Q2 (27 Nov 2026):
the rules in tools/store_rules.json are pasted into the Firebase console by Shad; this test shows whether they are in force.
It never touches a real code: the throwaway code is made up here and is 32 random letters long.
"""
import json
import secrets
import sys
import time
import urllib.error
import urllib.request

BASE = "https://red-team-path-default-rtdb.firebaseio.com/"
ABC = "abcdefghijkmnpqrstuvwxyz23456789"
code = "".join(secrets.choice(ABC) for _ in range(32))
pin = "".join(secrets.choice(ABC) for _ in range(8))
now = int(time.time() * 1000)
today = time.strftime("%Y-%m-%d")
fails = []


def call(method, path, body=None):
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(BASE + path + ".json", data=data, method=method, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as err:
        return err.code, err.read().decode("utf-8", "replace")


def expect(what, ok_wanted, method, path, body=None):
    status, _ = call(method, path, body)
    ok = (status == 200) == ok_wanted
    print(("ok   " if ok else "FAIL ") + "%s: %s (answered %d)" % ("accepted" if ok_wanted else "refused", what, status))
    if not ok:
        fails.append(what)


rec = "sync/" + code
try:
    # what the app really sends
    expect("a whole record, as the app sends it", True, "PUT", rec, {"m": {"v1": now}, "y": {today: now}, "r": 0, "b": 1})
    expect("a tick and a missed review, as one partial save", True, "PATCH", rec, {"m/v2": now, "m/r1v1": -now})
    expect("a study day and a best streak", True, "PATCH", rec, {"y/" + today: now, "b": 2})
    expect("a clear-all time", True, "PATCH", rec, {"r": now})
    expect("reading the record back", True, "GET", rec)
    expect("a pairing code, stamped with the store's own time", True, "PUT", "pair/" + pin, {"c": code, "t": {".sv": "timestamp"}})
    expect("reading the pairing code", True, "GET", "pair/" + pin)
    # junk
    expect("the same pairing code written a second time", False, "PUT", "pair/" + pin, {"c": code, "t": {".sv": "timestamp"}})
    expect("free text in place of a whole record", False, "PUT", rec, "x" * 20000)
    expect("a record under a 33-letter code", False, "PUT", "sync/" + code + "a", {"m": {"v1": now}, "r": 0, "b": 0})
    expect("2,001 marks in one record", False, "PATCH", rec, {"m/zz%d" % k: now for k in range(2001)})
    expect("a clear-all time far in the future", False, "PATCH", rec, {"r": 10 ** 15})
    expect("a mark time of 1e300", False, "PATCH", rec, {"m/v3": 1e300})
    expect("a mark that is text", False, "PATCH", rec, {"m/v3": "hello"})
    expect("a key the app never writes", False, "PATCH", rec, {"notes": "hello"})
    expect("listing every record", False, "GET", "sync")
finally:
    call("DELETE", "pair/" + pin)
    status, _ = call("DELETE", rec)
    call("DELETE", "sync/" + code + "a")
    print("the throwaway record was deleted (answered %d)" % status)

print("FAILED: %d" % len(fails) if fails else "ALL PASSED")
sys.exit(1 if fails else 0)
