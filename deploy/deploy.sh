#!/usr/bin/env bash
#
# Deploy the current branch to production. Safe to run repeatedly.
#
#   bash /srv/mudhotech/deploy/deploy.sh
#
# The live site keeps serving throughout the build. Next.js builds go into
# two alternating directories, .next-blue and .next-green: each deploy builds
# into whichever one is NOT live, then points the service at it and restarts.
# Building into the live directory (as this script used to) deletes the
# hashed JS/CSS the running server's pages reference: measured locally, about
# a quarter of asset requests failed for the whole build, so visitors got
# unstyled, non-interactive pages for a minute or two. A failed build now
# leaves the live site untouched instead of half-written.

set -euo pipefail

APP_USER=mudhotech
APP_ROOT=/srv/mudhotech
BRANCH=main

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }

# A failed check now triggers a rollback, so give Next up to ~30s to come up
# rather than judging it on a single request after a fixed sleep.
wait_for_web() {
  local code=000
  for _ in $(seq 1 15); do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3200/ || true)
    [[ "$code" == 200 ]] && break
    sleep 2
  done
  echo "$code"
}

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

# The live slot is whatever the web unit's slot file names. No file means a
# server deployed before slots existed, still serving the default .next.
SLOT_FILE="$APP_ROOT/frontend/.next-slot.env"
live_slot=$(sed -n 's/^NEXT_DIST_DIR=//p' "$SLOT_FILE" 2>/dev/null || true)
if [[ "$live_slot" == ".next-blue" ]]; then build_slot=.next-green; else build_slot=.next-blue; fi

log "Building into $build_slot (live: ${live_slot:-.next})"
# The same NEXT_DIST_DIR has to be used by `next start`: the build embeds its
# distDir in the compiled route modules, so it cannot be renamed into place.
sudo -u "$APP_USER" NEXT_DIST_DIR="$build_slot" npm --prefix frontend run build

log "systemd units"
# Install the units from the repo whenever they differ, so a change to one
# (like the slot EnvironmentFile) reaches the server without re-provisioning.
# Same npm path substitution as provision.sh.
npm_bin=$(command -v npm)
units_changed=0
for unit in mudhotech-api.service mudhotech-web.service; do
  rendered=$(mktemp)
  sed "s|ExecStart=/usr/bin/npm|ExecStart=${npm_bin}|" "deploy/$unit" > "$rendered"
  if ! cmp -s "$rendered" "/etc/systemd/system/$unit"; then
    install -m 644 "$rendered" "/etc/systemd/system/$unit"
    echo "  updated $unit"
    units_changed=1
  fi
  rm -f "$rendered"
done
if [[ $units_changed -eq 1 ]]; then systemctl daemon-reload; else echo "  unchanged"; fi

log "Switching to $build_slot and restarting services"
printf 'NEXT_DIST_DIR=%s\n' "$build_slot" > "$SLOT_FILE"
systemctl restart mudhotech-api
systemctl restart mudhotech-web
sleep 4

log "Health check"
fail=0
api=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 http://127.0.0.1:8200/api/health/ || true)
web=$(wait_for_web)
pub=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://mudhotech.com/ || true)

printf '  django  (127.0.0.1:8200)  %s\n' "$api"
printf '  next    (127.0.0.1:3200)  %s\n' "$web"
printf '  public  (https)           %s\n' "$pub"

[[ "$api" == 200 ]] || { echo "  ! Django unhealthy:  journalctl -u mudhotech-api -n 50"; fail=1; }

if [[ "$web" != 200 ]]; then
  # The previous build is still intact in the other slot, so going back is a
  # restart, not a rebuild. It restores the previous build output; the
  # checkout and node_modules stay at the new commit, which is fine unless
  # this deploy also changed the Next.js version.
  echo "  ! Next unhealthy on $build_slot — rolling back to ${live_slot:-.next}"
  echo "    see: journalctl -u mudhotech-web -n 50"
  if [[ -n "$live_slot" ]]; then
    printf 'NEXT_DIST_DIR=%s\n' "$live_slot" > "$SLOT_FILE"
  else
    rm -f "$SLOT_FILE"
  fi
  systemctl restart mudhotech-web
  web=$(wait_for_web)
  printf '  next after rollback       %s\n' "$web"
  fail=1
elif [[ -z "$live_slot" && -d frontend/.next ]]; then
  # First slot deploy succeeded; the pre-slot build directory is now unused.
  rm -rf frontend/.next
fi

if [[ $fail -eq 0 ]]; then
  log "Deployed."
else
  log "Deployed WITH ERRORS — see above."
  exit 1
fi
