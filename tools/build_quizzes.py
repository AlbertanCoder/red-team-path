"""Builds quizzes.js: the quiz under each video, and the quiz on every other box that has one, after checking every question against its source.
Usage: python tools/build_quizzes.py [questions folder] [transcripts folder] [sources folder]
Defaults: ~/redteam/learn/quizzes, ~/redteam/learn/transcripts and ~/redteam/learn/sources. The subtitles and the saved course text belong to
Microsoft and the course makers, so they stay on this computer, not in the repo.

Video questions (ep1.json to ep10.json) are refused unless:
  - they have a question, four different options, one right answer, a kind (recall or apply) and a rewatch hint with a time in it
  - their supporting quote is in the subtitles word for word, starting within 20 seconds of its time
  - their hint does not give the right answer away
Box questions (<box id>.json, for example fc1.json, checked against sources/<box id>.txt) are refused unless:
  - they have a question, four different options, one right answer, a kind (recall, apply or code) and a hint saying where to look
  - "where" names a lesson in the saved source; a recall or apply question's quote is in that lesson word for word
  - a code question's snippet was run here: "prints" means Python printed exactly the right option and none of the others;
    "raises" means it stopped with an error whose name is in the right option and in no other option;
    "bug" (spot the bug) needs a "fixed" version; "lang": "bash" runs a shell question in Git Bash instead of Python;
    a "fixed" version, if given, must run and print "expect", while the snippet as shown must not
  - their hint does not give the right answer away
"""
import json
import subprocess
import tempfile
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
QDIR = pathlib.Path(ARGS[0]) if len(ARGS) > 0 else pathlib.Path.home() / "redteam" / "learn" / "quizzes"
TDIR = pathlib.Path(ARGS[1]) if len(ARGS) > 1 else pathlib.Path.home() / "redteam" / "learn" / "transcripts"
SDIR = pathlib.Path(ARGS[2]) if len(ARGS) > 2 else pathlib.Path.home() / "redteam" / "learn" / "sources"
BOX_ID = re.compile(r"^[a-z]{2}\d{1,2}$")
OUT = ROOT / "quizzes.js"


def norm(text):
    text = text.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[^a-z0-9']+", " ", text.lower()).strip()


def secs(stamp):
    m, s = stamp.strip("[]").split(":")
    return int(m) * 60 + int(s)


def lessons(text):
    """A saved source: lessons that start with '@@@ <title> | <address>'. Returns {title: (address, normalised text)}."""
    out = {}
    for chunk in re.split(r"^@@@ ", text, flags=re.M)[1:]:
        head, body = chunk.split("\n", 1)
        title, url = head.rsplit(" | ", 1)
        out[title.strip()] = (url.strip(), norm(body))
    return out


# Shell questions run in Git Bash, named by its full path so Windows never starts WSL's bash instead.
GIT_BASH = pathlib.Path("C:/Program Files/Git/bin/bash.exe")


def run_py(code, lang="python"):
    """Runs a snippet in a fresh, empty folder. Returns (exit code, what it printed, the name of the error it stopped with)."""
    if lang == "bash":
        if not GIT_BASH.exists():
            return 1, "", "NoGitBash"
        cmd = [str(GIT_BASH), "--noprofile", "--norc", "-c", code]
    else:
        cmd = [sys.executable, "-I", "-c", code]
    with tempfile.TemporaryDirectory() as d:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=10, cwd=d)
        except subprocess.TimeoutExpired:
            return 1, "", "Timeout"
    last = (r.stderr.strip().splitlines() or [""])[-1]
    m = re.match(r"(?:[\w.]+\.)?(\w+(?:Error|Exception|Interrupt|Exit))\b", last)  # json.decoder.JSONDecodeError -> JSONDecodeError
    return r.returncode, r.stdout.rstrip("\n"), m.group(1) if m else ""


def check_box(box, qs, lessons_by_title, problems):
    kept = []
    for i, q in enumerate(qs):
        tag = "%s q%d" % (box, i + 1)
        opts = q.get("options") or []
        bad = []
        if not str(q.get("q", "")).strip():
            bad.append("no question")
        if len(opts) != 4 or len({o.strip() for o in opts}) != 4:
            bad.append("needs four different options")
        if q.get("answer") not in (0, 1, 2, 3):
            bad.append("answer is not 0 to 3")
        kind = q.get("kind")
        if kind not in ("recall", "apply", "code"):
            bad.append("kind is not recall, apply or code")
        if not str(q.get("hint", "")).strip():
            bad.append("no hint saying where to look")
        where = q.get("where", "")
        if where not in lessons_by_title:
            bad.append("'where' is not a lesson in the source: %s" % where[:60])
        elif kind in ("recall", "apply") or q.get("quote"):
            quote = norm(q.get("quote", ""))
            if not quote or quote not in lessons_by_title[where][1]:
                bad.append("quote not found in the lesson '%s'" % where[:50])
        if kind == "code" and not bad:
            code, check = q.get("code", ""), q.get("check")
            lang = q.get("lang", "python")
            rc, out, err = run_py(code, lang)
            right = opts[q["answer"]].strip()
            if check == "prints":
                if rc != 0:
                    bad.append("the snippet stopped with %s instead of printing" % (err or "an error"))
                elif out.strip() != right:
                    bad.append("Python printed %r, not the right option %r" % (out[:60], right[:60]))
                elif any(o.strip() == out.strip() for k, o in enumerate(opts) if k != q["answer"]):
                    bad.append("a wrong option is also what Python printed")
            elif check == "raises":
                if rc == 0 or not err:
                    bad.append("the snippet did not stop with an error")
                elif err not in right or any(err in o for k, o in enumerate(opts) if k != q["answer"]):
                    bad.append("the error %s must be named in the right option only" % err)
            elif check == "bug":
                if q.get("fixed") is None:
                    bad.append("a spot-the-bug question needs its fixed version")
            else:
                bad.append("a code question needs check: prints, raises or bug")
            if not bad and q.get("fixed") is not None:
                frc, fout, ferr = run_py(q["fixed"], lang)
                if frc != 0 or fout.strip() != str(q.get("expect", "")).strip():
                    bad.append("the fixed version does not print what it should (%s)" % (ferr or repr(fout[:40])))
                elif rc == 0 and out.strip() == str(q.get("expect", "")).strip():
                    bad.append("the code as shown already works, so there is no bug to spot")
        if not bad:
            right = norm(opts[q["answer"]])
            if len(right) > 12 and right in norm(q["hint"]):
                bad.append("hint gives the answer away")
        if bad:
            problems.append("%s: %s  [%s]" % (tag, "; ".join(bad), q.get("q", "")[:70]))
        else:
            k = {"q": q["q"], "options": opts, "answer": q["answer"], "kind": kind, "hint": q["hint"], "where": where, "url": lessons_by_title[where][0]}
            if q.get("code"):
                k["code"] = q["code"]
            if q.get("setup"):
                k["setup"] = q["setup"]
            kept.append(k)
    return kept


def guess_check(name, kept, problems):
    # Guessing by length must not pass: always picking the longest, or the shortest, option has to stay under the pass mark (80%).
    need = -(-len(kept) * 8 // 10)
    for label, pick in (("longest", max), ("shortest", min)):
        hits = sum(1 for q in kept if pick(range(4), key=lambda i: len(q["options"][i])) == q["answer"])
        if kept and hits >= need:
            problems.append("%s: always picking the %s option gets %d of %d right, enough to pass. Even out the option lengths." % (name, label, hits, len(kept)))


def main():
    quizzes, problems = {}, []
    for n in range(1, 11):
        qfile, tfile = QDIR / ("ep%d.json" % n), TDIR / ("ep%d.txt" % n)
        if not qfile.exists():
            problems.append("ep%d: no question file" % n)
            continue
        lines = []
        for raw in tfile.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\[(\d+:\d\d)\] (.*)", raw)
            if m:
                lines.append((secs(m.group(1)), norm(m.group(2))))
        qs = json.loads(qfile.read_text(encoding="utf-8"))
        kept = []
        for i, q in enumerate(qs):
            tag = "ep%d q%d" % (n, i + 1)
            opts = q.get("options") or []
            bad = []
            if not str(q.get("q", "")).strip():
                bad.append("no question")
            if len(opts) != 4 or len({norm(o) for o in opts}) != 4:
                bad.append("needs four different options")
            if q.get("answer") not in (0, 1, 2, 3):
                bad.append("answer is not 0 to 3")
            if q.get("kind") not in ("recall", "apply"):
                bad.append("kind is not recall or apply")
            if not re.search(r"\d+:\d\d", q.get("hint", "")):
                bad.append("hint has no time in it")
            # the quote must be in the subtitles, starting near the stated time
            at = secs(q.get("at", "0:00"))
            quote = norm(q.get("quote", ""))
            start = [k for k, (t, _) in enumerate(lines) if abs(t - at) <= 20]
            found = any(quote and quote in " ".join(x for _, x in lines[k:k + 12]) for k in start)
            if not found:
                bad.append("quote not found within 20 s of %s" % q.get("at"))
            if not bad:
                right = norm(opts[q["answer"]])
                if len(right) > 12 and right in norm(q["hint"]):
                    bad.append("hint gives the answer away")
            if bad:
                problems.append("%s: %s  [%s]" % (tag, "; ".join(bad), q.get("q", "")[:70]))
            else:
                kept.append({"q": q["q"], "options": opts, "answer": q["answer"], "kind": q["kind"], "at": q["at"], "hint": q["hint"]})
        kinds = [q["kind"] for q in kept]
        spots = sorted({q["answer"] for q in kept})
        # Guessing by length must not pass: always picking the longest, or the shortest, option has to stay under the pass mark (80%).
        need = -(-len(kept) * 8 // 10)
        for name, pick in (("longest", max), ("shortest", min)):
            hits = sum(1 for q in kept if pick(range(4), key=lambda i: len(q["options"][i])) == q["answer"])
            if kept and hits >= need:
                problems.append("ep%d: always picking the %s option gets %d of %d right, enough to pass. Even out the option lengths." % (n, name, hits, len(kept)))
        print("ep%-2d %2d questions kept of %2d  (recall %d, apply %d; right answer sits in positions %s)" %
              (n, len(kept), len(qs), kinds.count("recall"), kinds.count("apply"), spots))
        quizzes[n] = kept
    for qfile in sorted(QDIR.glob("*.json"), key=lambda f: (re.sub(r"\d+", "", f.stem), int(re.sub(r"\D", "", f.stem) or 0))):
        box = qfile.stem
        if not BOX_ID.match(box) or box.startswith("ep"):
            continue
        sfile = SDIR / (box + ".txt")
        if not sfile.exists():
            problems.append("%s: no saved source at %s" % (box, sfile))
            continue
        qs = json.loads(qfile.read_text(encoding="utf-8"))
        kept = check_box(box, qs, lessons(sfile.read_text(encoding="utf-8")), problems)
        guess_check(box, kept, problems)
        kinds = [q["kind"] for q in kept]
        print("%-5s %2d questions kept of %2d  (recall %d, apply %d, code %d; right answer sits in positions %s)" %
              (box, len(kept), len(qs), kinds.count("recall"), kinds.count("apply"), kinds.count("code"), sorted({q["answer"] for q in kept})))
        quizzes[box] = kept
    for p in problems:
        print("REFUSED  " + p)
    text = ("// The quiz under each video (keys 1 to 10) and on every other box that has one (keys are box ids), built by\n"
            "// tools/build_quizzes.py from questions checked against the video's subtitles or the course's own saved text.\n"
            "// Edit the question files and rebuild; do not edit this file by hand.\nwindow.RTP_QUIZ = " +
            json.dumps(quizzes, ensure_ascii=False, indent=1) + ";\n")
    if "--check" in sys.argv:
        # The release script runs this: quizzes.js must be exactly what a fresh build makes (a hand edit, such as a wrong
        # right answer, shows up here even though every app test reads its answers from that same file).
        same = OUT.exists() and OUT.read_text(encoding="utf-8").replace("\r\n", "\n") == text
        print("quizzes.js matches a fresh build" if same else "quizzes.js is NOT what the build makes: rebuild it with tools/build_quizzes.py")
        sys.exit(0 if same and not problems else 1)
    if "--dry" not in sys.argv:
        OUT.write_text(text, encoding="utf-8", newline="\n")
        print("wrote %s (%d questions)" % (OUT.name, sum(len(v) for v in quizzes.values())))
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
