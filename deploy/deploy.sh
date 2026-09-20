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
sudo -u "$APP_USER" git fetch origin "$BRANCH"
sudo -u "$APP_USER" git checkout "$BRANCH"
sudo -u "$APP_USER" git reset --hard "origin/$BRANCH"

log "Backend dependencies"
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q -r backend/requirements.txt

log "Database migrations"
# Back up first. SQLite is a single file, so a copy is a complete snapshot —
# and this is the only thing standing between a bad migration and every lead
# the business has captured.
if [[ -f backend/db.sqlite3 ]]; then
  backup="backend/db.sqlite3.$(date +%Y%m%d-%H%M%S).bak"
  sudo -u "$APP_USER" cp backend/db.sqlite3 "$backup"
  echo "  Backed up to $backup"
fi
sudo -u "$APP_USER" bash -c "cd '$APP_ROOT/backend' && set -a && . ./.env && set +a && .venv/bin/python manage.py migrate --noinput"

log "Frontend dependencies"
# `npm ci` not `npm install`: it installs exactly what package-lock.json
# pins, so a deploy cannot silently pull a newer transitive dependency than
# the one the tests ran against.
sudo -u "$APP_USER" npm --prefix frontend ci --omit=dev --silent || \
  sudo -u "$APP_USER" npm --prefix frontend ci --silent

log "Building"
sudo -u "$APP_USER" npm --prefix frontend run build

log "Restarting services"
systemctl restart mudhotech-api
systemctl restart mudhotech-web
sleep 4

log "Health check"
fail=0
api=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8000/api/health/ || echo 000)
web=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ || echo 000)
pub=$(curl -s -o /dev/null -w '%{http_code}' https://mudhotech.com/ || echo 000)

printf '  django  (127.0.0.1:8000)  %s\n' "$api"
printf '  next    (127.0.0.1:3000)  %s\n' "$web"
printf '  public  (https)           %s\n' "$pub"

[[ "$api" == 200 ]] || { echo "  ! Django unhealthy:  journalctl -u mudhotech-api -n 50"; fail=1; }
[[ "$web" == 200 ]] || { echo "  ! Next unhealthy:    journalctl -u mudhotech-web -n 50"; fail=1; }

if [[ $fail -eq 0 ]]; then
  log "Deployed."
else
  log "Deployed WITH ERRORS — see above."
  exit 1
fi
