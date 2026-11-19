"""Tries each of the 4 layout previews at phone size: opens the tutor page, opens the 3 hints one at a time,
checks the answer stays locked until a line is typed, unlocks it, marks a result. Saves screenshots.
Usage: python preview_test.py <base url ending in /preview/> <out folder>
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

base = sys.argv[1]
out = pathlib.Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
fails = []


def check(cond, what):
    print(("ok   " if cond else "FAIL ") + what)
    if not cond:
        fails.append(what)


def text(page):
    return page.inner_text("body")


def run_hints(page, n, nexts=None):
    """Open hints 1..3, then the gate, then the answer. nexts = function to move forward between parts (layout 2)."""
    check("teacher preparing" not in text(page), f"layout {n}: answer hidden at the start")
    check("In one or two sentences" not in text(page), f"layout {n}: hint 3 hidden at the start")
    for i in (1, 2, 3):
        if nexts:
            nexts(i)
        page.get_by_role("button", name=f"Show hint {i}", exact=True).click()
        check(f"Hint {i}:" in text(page), f"layout {n}: hint {i} opens")
    if nexts:
        nexts(4)
    btn = page.get_by_role("button", name="I tried. Show the full answer")
    check(btn.is_disabled(), f"layout {n}: answer button is off until a line is typed")
    page.get_by_placeholder("What did you try? One line.").fill("I asked it nicely and it said no")
    check(btn.is_enabled(), f"layout {n}: answer button turns on after a line is typed")
    btn.click()
    check("teacher preparing" in text(page) and "Why it works" in text(page), f"layout {n}: full answer shows with why it works")
    check("VERIFIED" in text(page), f"layout {n}: verified label shows")


with sync_playwright() as p:
    b = p.chromium.launch()
    for n in (1, 2, 3, 4):
        ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m, e=errors: e.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda x, e=errors: e.append(str(x)))
        before = None
        page.goto(base + f"{n}.html")
        page.wait_for_timeout(300)
        before = page.evaluate("JSON.stringify(Object.keys(localStorage))")
        check("Lab 1: Credential Exfiltration" in text(page), f"layout {n}: home shows the lab he is on")
        check("Episode 4" in text(page) or n == 4, f"layout {n}: home shows what is next")
        page.screenshot(path=str(out / f"{n}-home.png"))
        if n == 1:
            page.get_by_role("button", name="Open this lab's tutor page").click()
            page.screenshot(path=str(out / "1-tutor.png"))
            run_hints(page, 1)
            page.get_by_role("button", name="← Back to the path").click()
            page.get_by_role("button", name="I beat it").click()
            check("Next: Episode 4" in text(page), "layout 1: next appears after marking the result")
        elif n == 2:
            page.get_by_role("button", name="Start: open the tutor").click()
            page.screenshot(path=str(out / "2-tutor.png"))
            for _ in range(3):
                page.get_by_role("button", name="Next ›").click()
            run_hints(page, 2, nexts=lambda i: page.get_by_role("button", name="Next ›").click() if i > 1 else None)
            page.get_by_role("button", name="Next ›").click()
            check("What's next" in text(page), "layout 2: last screen is what's next")
            page.get_by_role("button", name="Moving on, not solved").click()
            check("moved on" in text(page), "layout 2: result is marked")
        elif n == 3:
            page.get_by_role("button", name="Labs", exact=True).click()
            page.screenshot(path=str(out / "3-grid.png"))
            page.locator(".tile.now").click()
            page.screenshot(path=str(out / "3-tutor.png"))
            rows = {1: "Hint 1 · hidden", 2: "Hint 2 · hidden", 3: "Hint 3 · hidden", 4: "Full answer · locked"}
            run_hints(page, 3, nexts=lambda i: page.get_by_role("button", name=rows[i]).click())
            page.get_by_role("button", name="Today", exact=True).click()
            page.get_by_role("button", name="I beat it").click()
            check("beaten" in text(page), "layout 3: result is marked")
        else:
            page.screenshot(path=str(out / "4-tutor.png"), full_page=True)
            run_hints(page, 4)
            page.get_by_role("button", name="Path", exact=True).click()
            check("THE WHOLE PATH" in text(page) and "Episode 7" in text(page), "layout 4: the Path list opens")
            page.screenshot(path=str(out / "4-path.png"))
            page.get_by_role("button", name="Close").click()
            page.get_by_role("button", name="I beat it").click()
            check("Episode 4" in page.inner_text(".bar"), "layout 4: next appears in the bottom bar")
        page.screenshot(path=str(out / f"{n}-end.png"))
        side = page.evaluate("document.documentElement.scrollWidth > innerWidth")
        check(not side, f"layout {n}: no sideways scrolling")
        check(page.evaluate("JSON.stringify(Object.keys(localStorage))") == before, f"layout {n}: saved progress untouched (storage keys unchanged)")
        check(not errors, f"layout {n}: no page errors {errors[:2]}")
        ctx.close()
    b.close()

print("FAILED: %d" % len(fails) if fails else "ALL PASSED")
sys.exit(1 if fails else 0)
