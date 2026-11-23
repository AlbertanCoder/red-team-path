"""Walk-through of the LIVE site at phone size, for the things tools/app_test.py does not cover:
each of the 10 videos opens its player inside the app, and every box that has an Open button points at a real address.
Usage: python tools/walk_test.py https://albertancoder.github.io/red-team-path/
(tools/app_test.py already taps through all 49 boxes in order and opens all 12 lab pages. tools/linkcheck.py opens every link.)
"""
import sys

from playwright.sync_api import sync_playwright

base = sys.argv[1]
fails = []


def check(cond, what):
    print(("ok   " if cond else "FAIL ") + what)
    if not cond:
        fails.append(what)


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto(base)
    page.wait_for_selector("#top-title")
    for n in range(1, 11):
        page.evaluate("location.hash = '#i-v%d'" % n)
        page.wait_for_selector("#watch-btn")
        title = page.inner_text("#top-title")
        page.click("#watch-btn")
        page.wait_for_selector("#player")
        frame = page.frame_locator("#player")
        try:
            frame.locator("video, .html5-video-player, [class*='player']").first.wait_for(state="attached", timeout=30000)
            loaded = True
        except Exception:
            loaded = False
        src = page.get_attribute("#player", "src") or ""
        broken = False
        if loaded and "youtube" in src:
            broken = frame.locator(".ytp-error").count() > 0
        check(title.startswith("Episode %d:" % n) and loaded and not broken, "%s: the player opens inside the app (%s)" % (title, "YouTube" if "youtube" in src else "Microsoft"))
        check(page.locator("#player-fallback").count() == 1, "Episode %d: has the fall-back link to Microsoft's page" % n)
    # every other box: its Open button has a real https address, or it has no button because nothing needs opening
    if page.locator("#menu-btn").is_visible():
        page.click("#menu-btn")
    page.click("#path-btn")
    boxes = page.evaluate("Array.from(document.querySelectorAll('#sheet .prow')).map(function (r) { return r.id; }).filter(function (i) { return i.indexOf('row-') === 0; }).map(function (i) { return i.slice(4); })")
    page.click("#sheet-close")
    check(len(boxes) == 58, "the Path list holds all 58 boxes (49 required and 9 optional)")
    opened = 0
    for box in boxes:
        if box.startswith("v") or (box.startswith("m") and box != "m0"):
            continue
        page.evaluate("location.hash = '#i-%s'" % box)
        page.wait_for_function("document.getElementById('view-now').getAttribute('data-id') === '%s'" % box)
        if page.locator("#open-link").count():
            href = page.get_attribute("#open-link", "href") or ""
            check(href.startswith("https://"), "%s: its Open button has a web address" % page.inner_text("#top-title")[:50])
            opened += 1
        else:
            check(page.locator("#how-fold").count() == 1, "%s: no Open button, and it has its how-to steps" % page.inner_text("#top-title")[:50])
    print("boxes with an Open button: %d" % opened)
    ctx.close()
    b.close()

print("FAILED: %d" % len(fails) if fails else "ALL PASSED")
sys.exit(1 if fails else 0)
