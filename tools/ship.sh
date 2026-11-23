#!/usr/bin/env bash
# Ship one change: check the code, test the local copy, commit, push, wait for GitHub Pages to publish THIS commit,
# confirm the live file is the pushed one, then run the phone test on the live site.
# Usage: bash tools/ship.sh "commit subject" ["more commit text"]
# Stops at the first failure and says where.
set -u
cd "$(dirname "$0")/.." || exit 1
LIVE="https://albertancoder.github.io/red-team-path/"
subject="$1"; body="${2:-}"
node --check app.js || { echo "STOP: app.js has a syntax error"; exit 1; }
node tools/proof_test.js > /tmp/rtp_proof.txt 2>&1 || { echo "STOP: the lab-proof checker failed"; grep -v "^ok" /tmp/rtp_proof.txt; exit 1; }
python tools/app_test.py "file:///$(pwd -W 2>/dev/null || pwd)/index.html" > /tmp/rtp_local.txt 2>&1
if [ $? -ne 0 ]; then echo "STOP: the test failed on the local copy"; grep -v "^ok" /tmp/rtp_local.txt | tail -20; exit 1; fi
echo "local test: $(tail -1 /tmp/rtp_local.txt) ($(grep -c '^ok' /tmp/rtp_local.txt) checks)"
git add -A
# The helper that made the change is named by whoever runs this, so the label is never a stale copy:
#   RTP_CO_AUTHOR="Claude Opus 5.5 <noreply@anthropic.com>" RTP_SESSION="https://claude.ai/code/session_..." bash tools/ship.sh "subject" "body"
# Leave both unset for a change made by hand: the commit then carries no helper label.
trailer=""
[ -n "${RTP_CO_AUTHOR:-}" ] && trailer="Co-Authored-By: $RTP_CO_AUTHOR"
[ -n "${RTP_SESSION:-}" ] && trailer="${trailer:+$trailer
}Claude-Session: $RTP_SESSION"
if [ -n "$trailer" ]; then
  git commit -q -m "$subject" -m "$body" -m "$trailer" 2>/dev/null || { echo "STOP: nothing to commit"; exit 1; }
else
  git commit -q -m "$subject" -m "$body" 2>/dev/null || { echo "STOP: nothing to commit"; exit 1; }
fi
git pull -q --rebase 2>/dev/null
git push -q || { echo "STOP: push failed"; exit 1; }
sha=$(git rev-parse HEAD)
echo "pushed: $(git log -1 --format='%h %s')"
id=""
for try in 1 2 3 4 5 6 7 8 9 10 11 12; do
  id=$(gh run list --limit 10 --json databaseId,name,headSha --jq "[.[] | select(.name==\"pages build and deployment\" and .headSha==\"$sha\")][0].databaseId" 2>/dev/null)
  [ -n "$id" ] && [ "$id" != "null" ] && break
  ping -n 3 127.0.0.1 >/dev/null 2>&1
done
gh run watch "$id" --exit-status --interval 5 >/dev/null 2>&1 || { echo "STOP: GitHub Pages did not publish (run $id)"; exit 1; }
want=$(git rev-parse HEAD:app.js)
got=$(curl -fsS -m 20 "${LIVE}app.js?nocache=$sha" | git hash-object --stdin)
[ "$want" = "$got" ] || { echo "STOP: the live app.js is not the pushed one"; exit 1; }
echo "live: app.js matches the pushed file; page loads $(curl -fsS -m 20 "$LIVE?nocache=$sha" | grep -o 'app.js?v=[0-9a-z]*')"
python tools/app_test.py "$LIVE" > /tmp/rtp_live.txt 2>&1
if [ $? -ne 0 ]; then echo "STOP: the test failed on the LIVE site"; grep -v "^ok" /tmp/rtp_live.txt | tail -20; exit 1; fi
echo "live test: $(tail -1 /tmp/rtp_live.txt) ($(grep -c '^ok' /tmp/rtp_live.txt) checks)"
