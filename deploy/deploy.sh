#!/usr/bin/env bash
#
# Deploy the current branch to production. Safe to run repeatedly.
#
#   bash /srv/mudhotech/deploy/deploy.sh
#
# Order matters: build BEFORE restarting anything. `next build` takes a
# minute or two, and building after the restart would leave the site serving
# a half-written .next directory for that whole window.

set -euo pipefail

APP_USER=mudhotech
APP_ROOT=/srv/mudhotech
BRANCH=main

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }

[[ $EUID -eq 0 ]] || { echo "Run as root."; exit 1; }

log "Fetching $BRANCH"
cd "$APP_ROOT"
# This script lives in the repo it is about to overwrite. bash reads a
# script incrementally, so `git reset --hard` replacing deploy.sh mid-run
# leaves the rest of THIS execution using the old content — a fix to
# deploy.sh appears to pull successfully and then not take effect, which is
# a genuinely confusing five minutes. Hash before and after, and re-exec if
# it moved.
self_before=$(sha256sum "$0" | cut -d" " -f1)

sudo -u "$APP_USER" git fetch origin "$BRANCH"
sudo -u "$APP_USER" git checkout "$BRANCH"
sudo -u "$APP_USER" git reset --hard "origin/$BRANCH"

self_after=$(sha256sum "$0" | cut -d" " -f1)
if [[ "$self_before" != "$self_after" && -z "${DEPLOY_REEXEC:-}" ]]; then
  log "deploy.sh changed in this pull — restarting with the new version"
  DEPLOY_REEXEC=1 exec bash "$0" "$@"
fi

log "Backend dependencies"
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q -r backend/requirements.txt

log "Database migrations"
# Back up first. SQLite is a single file, so a copy is a complete snapshot —
# and this is the only thing standing between a bad migration and every lead
# the business has captured.
#
# sqlite3's online backup API, not `cp`: the API is still serving requests
# at this point, and a plain copy taken mid-write can be a corrupt file.
if [[ -f backend/db.sqlite3 ]]; then
  backup="backend/db.sqlite3.$(date +%Y%m%d-%H%M%S).bak"
  sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/python" -c '
import sqlite3, sys
src, dst = sqlite3.connect(sys.argv[1]), sqlite3.connect(sys.argv[2])
with dst:
    src.backup(dst)
' backend/db.sqlite3 "$backup"
  echo "  Backed up to $backup"
  # Keep the newest 20. Every deploy adds one and nothing removed them, so
  # the disk shared with the other sites on this box slowly filled up.
  ls -1t backend/db.sqlite3.*.bak 2>/dev/null | tail -n +21 | xargs -r rm -f --
fi
# NOT `set -a && . ./.env`: sourcing the file through bash breaks on any
# value containing spaces or angle brackets, and
#   DEFAULT_FROM_EMAIL=MudhoTech Solutions <noreply@mudhotech.com>
# is both — bash reads "Solutions" as a command and "<noreply@..." as a
# redirect. It is also unnecessary: config/settings.py calls load_dotenv()
# and reads .env itself.
sudo -u "$APP_USER" bash -c "cd '$APP_ROOT/backend' && .venv/bin/python manage.py migrate --noinput"

log "Frontend dependencies"
# `npm ci` not `npm install`: it installs exactly what package-lock.json
# pins, so a deploy cannot silently pull a newer transitive dependency than
# the one the tests ran against.
#
# Dev dependencies are required: `next build` needs typescript, tailwindcss,
# postcss and autoprefixer, which are all devDependencies. The old
# `--omit=dev` attempt only worked because husky's prepare script failed
# without them and tripped the fallback. HUSKY=0 skips git-hook setup,
# which is meaningless on the server.
sudo -u "$APP_USER" HUSKY=0 npm --prefix frontend ci --silent

log "Building"
sudo -u "$APP_USER" npm --prefix frontend run build

log "Restarting services"
systemctl restart mudhotech-api
systemctl restart mudhotech-web
sleep 4

log "Health check"
fail=0
api=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 http://127.0.0.1:8200/api/health/ || true)
web=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 http://127.0.0.1:3200/ || true)
pub=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://mudhotech.com/ || true)

printf '  django  (127.0.0.1:8200)  %s\n' "$api"
printf '  next    (127.0.0.1:3200)  %s\n' "$web"
printf '  public  (https)           %s\n' "$pub"

[[ "$api" == 200 ]] || { echo "  ! Django unhealthy:  journalctl -u mudhotech-api -n 50"; fail=1; }
[[ "$web" == 200 ]] || { echo "  ! Next unhealthy:    journalctl -u mudhotech-web -n 50"; fail=1; }

if [[ $fail -eq 0 ]]; then
  log "Deployed."
else
  log "Deployed WITH ERRORS — see above."
  exit 1
fi
