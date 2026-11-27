"""Link check for the learning material: every web address in app.js, quizzes.js, README.md and labs/SETUP.md, opened once.
Usage: python tools/linkcheck.py [repo folder]     Exit code 0 when no link is dead.

dead            the page answers 404 or 410, or the site cannot be reached at all
could not tell  the site refuses scripts (401, 403, 405, 429, 999). Open it in a browser to be sure.
Job ads are not checked here: tools/check_jobs.py does that every day and hides the dead ones.
The 10 videos are checked by their player address (Microsoft) or by YouTube's own "does this video exist" address.
"""
import concurrent.futures as cf
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "Accept": "text/html,application/json,*/*", "Accept-Language": "en-US,en;q=0.9"}
LEARN = "https://learn.microsoft.com/en-us"
SKIP = ("firebaseio.com", "youtube-nocookie.com/embed/", "localhost")
BLOCKED = (401, 403, 405, 429, 999)  # the site refuses scripts: could not tell


def urls_from(repo):
    found = {}
    for name in ("app.js", "quizzes.js", "README.md", "labs/SETUP.md"):
        p = repo / name
        if not p.exists():
            continue
        text = p.read_text(encoding="utf-8")
        for m in re.finditer(r"https?://[^\s\"'<>)\\`]+", text):
            found.setdefault(m.group(0).rstrip(".,;:"), name)
        if name == "app.js":
            for m in re.finditer(r"\"(/training/modules/[^\"]+)\"", text):
                found.setdefault(LEARN + m.group(1), name)
            for m in re.finditer(r"\"ms:([0-9a-f-]{36})\"", text):
                found.setdefault("https://learn-video.azurefd.net/vod/player?id=" + m.group(1), name)
            for m in re.finditer(r"\"yt:([\w-]{11})\"", text):
                found.setdefault("https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=" + m.group(1), name)
            sets = text[text.index("var GRAYSWAN = ["):text.index("var KIND = ")]
            for m in re.finditer(r"\", \"([a-z0-9-]+)\", \"", sets):
                found.setdefault("https://app.grayswan.ai/arena/challenge/" + m.group(1), name)
            # freeCodeCamp boxes: the course address plus each box's first lesson
            for m in re.finditer(r"\"((?:lecture|lab|workshop|review)-[a-z0-9-]+/[a-z0-9-]+)\"", text):
                found.setdefault("https://www.freecodecamp.org/learn/python-v9/" + m.group(1), name)
    return {u: f for u, f in found.items()
            if not any(s in u for s in SKIP) and not u.endswith(("?id=", "/embed/", "challenge/", "/sync/", "/pair/"))}


# GitHub answers 503 to scripts for every file page (github.com/.../blob/...), Microsoft's too, so the file itself is checked instead.
GITHUB_FILE = re.compile(r"^https://github\.com/([^/]+)/([^/]+)/blob/([^/]+)/([^#?]+)")


def check(u):
    m = GITHUB_FILE.match(u)
    target = "https://raw.githubusercontent.com/%s/%s/%s/%s" % m.groups() if m else u
    try:
        r = urllib.request.urlopen(urllib.request.Request(target, headers=UA), timeout=25)
        return u, r.status
    except urllib.error.HTTPError as e:
        return u, e.code
    except Exception:
        return u, 0


def main():
    repo = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent
    urls = urls_from(repo)
    with cf.ThreadPoolExecutor(8) as ex:
        res = list(ex.map(check, sorted(urls)))
    # A link is dead only if it fails three times in a row, a few seconds apart. One failed answer can be a busy site:
    # on 19 Nov 2026 one run of this check failed and the next five passed with nothing changed.
    for _ in range(2):
        if all(code == 200 or code in BLOCKED for _, code in res):
            break
        time.sleep(4)
        res = [(u, code) if code == 200 or code in BLOCKED else check(u) for u, code in res]
    blocked = [(c, u) for u, c in res if c in BLOCKED]
    dead = [(c, u) for u, c in res if c != 200 and c not in BLOCKED]
    print("links: %d  ok: %d  could not tell (site refuses scripts): %d  dead: %d" % (len(res), len(res) - len(blocked) - len(dead), len(blocked), len(dead)))
    for c, u in dead:
        print("DEAD  %s  %s  (in %s)" % (c, u, urls[u]))
    for c, u in blocked:
        print("could not tell  %s  %s" % (c, u))
    sys.exit(1 if dead else 0)


if __name__ == "__main__":
    main()
