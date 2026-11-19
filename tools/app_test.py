"""Phone-size test of the Red Team Path app (390 x 844). Run: python tools/app_test.py <address of the app> [folder for screenshots]
The address can be the live site or a local file address ending in /index.html or /.
It uses throwaway browser profiles, so nobody's real progress is touched. Exit code 0 means every check passed.

What it proves:
  1. A brand new visitor lands on the first video, with one clear next step.
  2. Progress saved by the OLD app (ticks, notes, hints opened in the old lab coach) is all still there in the new app.
  3. Lab 1's tutor page has exactly the six parts, hints open one at a time, and the full answer stays locked
     until all three hints are open and one line has been typed.
  4. "I beat it" and "Moving on, not solved" both save and both lead to the next step.
  5. The Path list and the side screens (Library, Words, Jobs, Settings) open and come back.
  7. Every one of the 12 labs has its own page with the six parts, three hints of its own (no hint is shared between
     labs), a verified or unverified label, and a full answer or a plain statement that there is none.
  6. The order: every video comes before its lab, optional boxes never block the way, and tapping through from the
     first video reaches the end in exactly the planned order with one Next at every point.
"""
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

base = sys.argv[1]
shots = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else None
if shots:
    shots.mkdir(parents=True, exist_ok=True)
fails = []
T = 1795000000000  # a time in Nov 2026, as the old app would have saved it

# What the old app (before 19 Nov 2026) left in the browser: 4 boxes ticked, one lesson passed, a note, and hints opened in the old lab coach.
OLD = {
    "redTeamPath.v2": json.dumps({"m": {"v1": T, "v2": T + 1, "m0": T + 2, "v3": T + 3, "t1": T + 4, "w5": T + 5}, "y": {"2026-11-18": T}, "r": 0, "best": 1,
                                  "theme": "dark", "open": {}, "test": False, "sync": ""}),
    "redTeamPath.notes": json.dumps({"m1": "my old note about lab 1"}),
    "redTeamPath.tutor": json.dumps({"view": "coach", "step": 0, "lesson": "", "lab": 1, "hints": {"1": 2, "2": 4}, "note": ""}),
}
# The planned order. Step 1 as the Path list shows it (optional boxes included), Step 5, and the required boxes from start to finish.
STEP1 = "v1 v2 m0 v3 m1 w1 v4 m6 w2 v5 m2 w3 v6 m5 w4 v7 m7 m8 m11 m12 m3 m4 m9 m10".split()
STEP5 = "v8 a1 v9 a2 v10 a3 a4".split()
OPTIONAL = "w1 w2 w3 w4 w5 m3 m4 m9 m10".split()
ROAD = ("v1 v2 m0 v3 m1 v4 m6 v5 m2 v6 m5 v7 m7 m8 m11 m12 s0 s1 s2 s3 g1 g2 g3 g4 g5 g6 g7 g8 g9 "
        "py1 py2 py3 py4 py5 py6 py7 py8 v8 a1 v9 a2 v10 a3 a4 p1 b1 b2 b3 b4").split()
VERIFIED = {1, 2, 5, 6, 7, 8, 11}   # answers that were run in the real lab and won
NO_ANSWER = {4, 10, 12}             # 4: toxin goal, no answer on purpose. 10 and 12: no known answer.
PARTS = ["What this lab is", "The objective", "How to think about it", "Hints", "Full answer", "What's next"]


def check(cond, what):
    print(("ok   " if cond else "FAIL ") + what)
    if not cond:
        fails.append(what)


def new_page(browser, saved=None):
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    if saved:
        # Put the old saved data in place before the app starts, once, the way a returning visitor's browser has it.
        ctx.add_init_script("if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); var d = %s; Object.keys(d).forEach(function (k) { localStorage.setItem(k, d[k]); }); }" % json.dumps(saved))
    page = ctx.new_page()
    page.errors = []
    page.on("console", lambda m: page.errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: page.errors.append(str(e)))
    page.goto(base)
    page.wait_for_selector("#top-title")
    page.wait_for_timeout(300)
    return ctx, page


def ticks(page):
    return page.evaluate("JSON.parse(localStorage.getItem('redTeamPath.v2') || '{}').m || {}")


def shot(page, name, full=False):
    if shots:
        page.screenshot(path=str(shots / (name + ".png")), full_page=full)


def no_side_scroll(page, where):
    check(not page.evaluate("document.documentElement.scrollWidth > innerWidth + 1"), where + ": no sideways scrolling")


with sync_playwright() as p:
    b = p.chromium.launch()

    # ---- 1. a brand new visitor ----
    ctx, page = new_page(b)
    check(page.inner_text("#top-title").startswith("Episode 1"), "new visitor: opens on Episode 1")
    check("NOW" in page.inner_text("#top-tag"), "new visitor: the top strip says NOW")
    check("EPISODE 2" in page.inner_text("#next-line").upper(), "new visitor: the bottom bar says what is next (Episode 2)")
    check(page.locator("#watch-btn").is_visible() and page.locator("#done-btn").is_visible(), "new visitor: a video shows Watch and I'm done")
    shot(page, "1-new-visitor")
    page.click("#path-btn")
    check(page.locator("#sheet-count").inner_text().startswith("THE WHOLE PATH") and page.locator("#row-v1.now").count() == 1, "Path list opens and marks where you are")
    shot(page, "1-path")
    page.click("#also-jobs")
    check(page.inner_text("#top-title") == "Jobs" and page.locator("#view-jobs").is_visible(), "Jobs opens from the Path list")
    page.click("#back-now")
    check(page.inner_text("#top-title").startswith("Episode 1"), "Back returns to what you were doing")
    for name, title in (("tutor", "Library"), ("words", "Words"), ("menu", "Settings")):
        page.click("#path-btn")
        page.click("#also-" + name)
        check(page.inner_text("#top-title") == title and page.locator("#view-" + name).is_visible(), title + " opens from the Path list")
        no_side_scroll(page, title)
        page.click("#back-now")
    page.click("#done-btn")
    check(ticks(page).get("v1", 0) > 0 and "MARKED" in page.inner_text("#next-line"), "I'm done ticks the box and shows what is next")
    page.click("#next-btn")
    check(page.inner_text("#top-title").startswith("Episode 2"), "the Next button goes to Episode 2")
    check(not page.errors, "new visitor: no page errors %s" % page.errors[:2])
    ctx.close()

    # ---- 2 and 3. a returning visitor with progress saved by the old app ----
    ctx, page = new_page(b, OLD)
    m = ticks(page)
    check(all(m.get(k, 0) > 0 for k in ("v1", "v2", "m0", "v3", "t1", "w5")), "old ticks are all still there (4 boxes, 1 lesson, and 1 box that is now optional)")
    check(page.inner_text("#top-title") == "Lab 1: Credential Exfiltration", "returning visitor: opens straight on Lab 1")
    check(page.evaluate("JSON.parse(localStorage.getItem('redTeamPath.notes')).m1") == "my old note about lab 1", "the old note for lab 1 is still there")
    check(all(m.get(k, 0) > 0 for k in ("ha1", "hb1", "ha2", "hb2", "hc2", "tr2")) and not m.get("hc1", 0) > 0, "hints opened in the old lab coach carried over (lab 1: two, lab 2: all and the answer)")
    parts = page.locator("#view-now .part h2").all_inner_texts()
    check([x.strip().lower() for x in parts] == [x.lower() for x in PARTS], "Lab 1 page has exactly the six parts, in order: %s" % parts)
    body = page.inner_text("#view-now")
    check("Hint 1." in body and "Hint 2." in body and "Hint 3." not in body, "the two hints opened before are showing, the third is hidden")
    check("teacher preparing" not in body and page.locator("#answer-locked").is_visible(), "the full answer is locked")
    check("VERIFIED" in page.inner_text("#lab-label"), "the page is labelled verified")
    shot(page, "2-lab1", full=True)
    page.click("#hint-btn")
    check("Hint 3." in page.inner_text("#view-now") and page.locator("#hint-btn").count() == 0, "hint 3 opens, and there is no fourth hint button")
    check(page.locator("#tried-btn").is_disabled(), "the answer button is off until a line is typed")
    page.fill("#tried-box", "I said I was a student and it refused")
    check(page.locator("#tried-btn").is_enabled(), "the answer button turns on after a line is typed")
    page.click("#tried-btn")
    ans = page.inner_text("#lab-answer")
    check("teacher preparing" in ans and "Why it works." in ans and "VERIFIED" in ans, "the full answer shows, with why it works and the verified label")
    note = page.evaluate("JSON.parse(localStorage.getItem('redTeamPath.notes')).m1")
    check(note.startswith("my old note about lab 1") and "Tried: I said I was a student" in note, "the typed line is added to the lab's note, under the old note")
    shot(page, "2-lab1-answer", full=True)
    no_side_scroll(page, "Lab 1 page")
    nxt = page.inner_text("#next-line").upper()
    check(nxt.startswith("NEXT") and "EPISODE 4" in nxt, "the bottom bar says what is next after Lab 1: Episode 4")
    nx = page.inner_text("#lab-next")
    check("Episode 4" in nx and "Lab 6" in nx and "Write-up 1" in nx and "ptional" in nx, "What's next names Episode 4, the lab it prepares for, and the optional write-up")
    check(page.locator("#beat-btn").is_visible() and page.locator("#moved-btn").is_visible(), "a lab shows I beat it and Moving on, not solved")
    page.click("#beat-btn")
    m = ticks(page)
    check(m.get("m1", 0) > 0 and not m.get("un1", 0) > 0 and "BEATEN" in page.inner_text("#next-line"), "I beat it: lab 1 is ticked and marked beaten")
    page.reload()
    page.wait_for_selector("#top-title")
    m = ticks(page)
    check(m.get("m1", 0) > 0 and m.get("tr1", 0) > 0 and page.inner_text("#top-title") != "Lab 1: Credential Exfiltration", "after closing and reopening, everything is still saved and the app has moved on")
    page.click("#path-btn")
    page.click("#row-m1")
    check(page.inner_text("#top-title") == "Lab 1: Credential Exfiltration" and "teacher preparing" in page.inner_text("#view-now"), "Lab 1's page can be reopened from the Path list, answer still unlocked")
    page.click("#back-now")
    check(not page.errors, "returning visitor: no page errors %s" % page.errors[:2])
    ctx.close()

    # ---- 4. moving on without solving ----
    ctx, page = new_page(b, OLD)
    page.click("#moved-btn")
    m = ticks(page)
    check(m.get("m1", 0) > 0 and m.get("un1", 0) > 0 and "MOVED ON" in page.inner_text("#next-line"), "Moving on: lab 1 is ticked and marked not solved")
    page.click("#undo-btn")
    m = ticks(page)
    check(not m.get("m1", 0) > 0 and not m.get("un1", 0) > 0 and page.locator("#beat-btn").is_visible(), "Undo takes the mark back")
    # hints can be hidden again from Settings, one lab at a time
    page.click("#path-btn")
    page.click("#also-menu")
    check(page.locator("#rehide-1").count() == 1 and page.locator("#rehide-2").count() == 1 and page.locator("#rehide-3").count() == 0, "Settings lists only the labs whose hints are open (1 and 2)")
    page.click("#rehide-1")
    m = ticks(page)
    check(not any(m.get(k, 0) > 0 for k in ("ha1", "hb1", "hc1", "tr1")) and m.get("ha2", 0) > 0 and m.get("v3", 0) > 0, "hiding Lab 1's hints leaves Lab 2's hints and every tick alone")
    page.click("#back-now")
    check("Hint 1." not in page.inner_text("#view-now") and "1 of 3" in page.inner_text("#hint-btn"), "Lab 1 starts again from Show hint 1 of 3")
    check(not page.errors, "moving on: no page errors %s" % page.errors[:2])
    ctx.close()

    # ---- 7. every lab's page ----
    ctx, page = new_page(b)
    seen_hints = {}
    for n in range(1, 13):
        page.evaluate("location.hash = '#i-m%d'" % n)
        page.wait_for_timeout(120)
        check(page.inner_text("#top-title").startswith("Lab %d: " % n), "lab %d: its page opens" % n)
        parts = [x.strip().lower() for x in page.locator("#view-now .part h2").all_inner_texts()]
        check(parts == [x.lower() for x in PARTS], "lab %d: exactly the six parts, in order" % n)
        label = page.inner_text("#lab-label")
        want = "VERIFIED" if n in VERIFIED else "UNVERIFIED"
        check(label.startswith(want), "lab %d: labelled %s" % (n, want.lower()))
        check(page.locator("#answer-locked").is_visible() and page.locator(".hintbox").count() == 0, "lab %d: hints hidden and answer locked at the start" % n)
        for k in (1, 2, 3):
            page.click("#hint-btn")
            check(page.locator(".hintbox").count() == k, "lab %d: hint %d opens alone" % (n, k))
        for k, text in enumerate(page.locator(".hintbox").all_inner_texts()):
            check(text not in seen_hints, "lab %d: hint %d is its own, not shared with lab %s" % (n, k + 1, seen_hints.get(text)))
            seen_hints[text] = n
        check("kind of technique" in page.locator("#hint-1").inner_text(), "lab %d: hint 1 names the kind of technique" % n)
        check(page.locator("#tried-btn").is_disabled(), "lab %d: answer still locked after three hints, until a line is typed" % n)
        page.fill("#tried-box", "this is what I tried in lab %d" % n)
        page.click("#tried-btn")
        ans = page.inner_text("#lab-answer")
        if n in NO_ANSWER:
            check(ans.startswith("No ") and "Why it works." not in ans, "lab %d: says plainly that there is no answer" % n)
        else:
            check("Why it works." in ans and want in ans, "lab %d: full answer with why it works and the %s label" % (n, want.lower()))
        check(len(page.inner_text("#lab-next")) > 10, "lab %d: says what is next" % n)
        no_side_scroll(page, "lab %d" % n)
    check(len(seen_hints) == 36, "36 different hints across the 12 labs")
    check(not page.errors, "lab pages: no page errors %s" % page.errors[:2])
    ctx.close()

    # ---- 6. the order of the path ----
    ctx, page = new_page(b)
    page.click("#path-btn")
    rows = lambda step: page.evaluate("Array.from(document.querySelectorAll('#pstep-%d .prow')).map(function (r) { return r.id.slice(4); })" % step)
    check(rows(1) == STEP1, "Step 1 order: each video, then its lab; harder versions after Episode 7; harmful-goal labs last")
    check(rows(5) == STEP5, "Step 5 order: Episodes 8, 9 and 10 each sit right before the task they show")
    check(page.inner_text("#sheet-count").endswith("0 OF 49 DONE"), "the count is out of 49 required boxes")
    opt = page.evaluate("Array.from(document.querySelectorAll('#sheet .prow')).filter(function (r) { return /OPTIONAL/.test(r.textContent); }).map(function (r) { return r.id.slice(4); })")
    check(sorted(opt) == sorted(OPTIONAL), "the 5 write-ups and labs 3, 4, 9, 10 are marked optional")
    page.click("#row-m3")
    check("OPTIONAL" in page.inner_text("#top-tag") and "EPISODE 1" in page.inner_text("#next-line").upper(), "an optional lab opens, and its Next still points at where you are")
    page.click("#back-now")
    walked = []
    for _ in range(60):
        box = page.get_attribute("#view-now", "data-id")
        if not box:
            break
        walked.append(box)
        page.click("#beat-btn" if page.locator("#beat-btn").count() else "#done-btn")
        page.click("#next-btn")
        page.wait_for_timeout(720)
    check(walked == ROAD, "tapping through from the first video visits all 49 boxes in the planned order (got %d)" % len(walked))
    check(page.inner_text("#top-title") == "Every box is ticked", "the path ends on the finish screen")
    check(not page.errors, "walking the path: no page errors %s" % page.errors[:2])
    ctx.close()
    b.close()

print("FAILED: %d" % len(fails) if fails else "ALL PASSED")
sys.exit(1 if fails else 0)
