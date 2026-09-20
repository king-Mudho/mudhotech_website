#!/usr/bin/env bash
#
# First-time server setup for mudhotech.com on a root VPS.
# Run ONCE, as root, on 66.29.139.201.
#
#   bash provision.sh
#
# This box already hosts other sites. Everything here is additive and scoped
# to mudhotech.com: it does not touch existing nginx server blocks, and it
# does not enable a firewall (turning ufw on blind would cut off the other
# sites and possibly your own SSH session).

set -euo pipefail

APP_USER=mudhotech
APP_ROOT=/srv/mudhotech
REPO=https://github.com/king-Mudho/mudhotech_website.git
BRANCH=main
DOMAIN=mudhotech.com

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }

[[ $EUID -eq 0 ]] || { echo "Run as root."; exit 1; }

log "Checking what is already on this box"
nginx -v 2>&1 || echo "  nginx: not installed"
node --version 2>/dev/null || echo "  node: not installed"
python3 --version 2>/dev/null || echo "  python3: not installed"
echo "  Existing nginx sites:"
ls -1 /etc/nginx/sites-enabled/ 2>/dev/null | sed 's/^/    /' || echo "    (none)"

# Port collision is the most likely way this breaks the sites already here.
# ABI runs a Next.js app on this box and will hold the default 3000, so
# mudhotech uses 3100/8100 — but verify rather than assume, because the
# failure mode is one service silently refusing to start on EADDRINUSE.
log "Checking ports 3100 and 8100 are free"
echo "  Currently listening:"
ss -ltnp 2>/dev/null | awk 'NR>1 {print "    " $4 "  " $6}' | sort -u | head -20
for port in 3100 8100; do
  if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${port}\$"; then
    echo
    echo "  !! Port ${port} is already in use."
    echo "     Pick free ports and change them in all four places:"
    echo "       deploy/nginx-mudhotech.conf      (proxy_pass)"
    echo "       deploy/mudhotech-web.service     (Environment=PORT)"
    echo "       deploy/mudhotech-api.service     (--bind)"
    echo "       frontend/.env.production         (INTERNAL_API_URL)"
    exit 1
  fi
  echo "  port ${port}: free"
done

log "Installing packages"
apt-get update -qq
apt-get install -y -qq git curl nginx python3-venv python3-pip certbot python3-certbot-nginx

# Node 20 LTS. Checked first so we do not clobber a newer runtime the other
# sites on this box might depend on.
if ! command -v node >/dev/null || [[ "$(node -v | cut -c2-3)" -lt 20 ]]; then
  log "Installing Node.js 20 LTS"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
else
  log "Node $(node -v) already present — leaving it alone"
fi

log "Creating service user '$APP_USER'"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"

log "Cloning into $APP_ROOT"
if [[ -d "$APP_ROOT/.git" ]]; then
  echo "  Already cloned — skipping."
else
  mkdir -p "$APP_ROOT"
  git clone --branch "$BRANCH" "$REPO" "$APP_ROOT"
fi
chown -R "$APP_USER:$APP_USER" "$APP_ROOT"

log "Python virtualenv + dependencies"
sudo -u "$APP_USER" python3 -m venv "$APP_ROOT/backend/.venv"
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q --upgrade pip
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q -r "$APP_ROOT/backend/requirements.txt"
# Gunicorn is the production server; it is not in requirements.txt because
# nothing needs it for local development.
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q gunicorn

log "Environment files"
for pair in "backend/.env.production.example:backend/.env" \
            "frontend/.env.production.example:frontend/.env.production"; do
  src="$APP_ROOT/${pair%%:*}"; dst="$APP_ROOT/${pair##*:}"
  if [[ -f "$dst" ]]; then
    echo "  $dst exists — not overwriting."
  else
    cp "$src" "$dst"; chown "$APP_USER:$APP_USER" "$dst"; chmod 600 "$dst"
    echo "  created $dst"
  fi
done

if ! grep -q '^DJANGO_SECRET_KEY=.\+' "$APP_ROOT/backend/.env"; then
  log "Generating DJANGO_SECRET_KEY"
  key=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))")
  sed -i "s|^DJANGO_SECRET_KEY=.*|DJANGO_SECRET_KEY=${key}|" "$APP_ROOT/backend/.env"
  echo "  Written to backend/.env (mode 600, never printed)."
fi

log "systemd units"
cp "$APP_ROOT/deploy/mudhotech-api.service" /etc/systemd/system/
cp "$APP_ROOT/deploy/mudhotech-web.service" /etc/systemd/system/
systemctl daemon-reload

log "nginx site"
cp "$APP_ROOT/deploy/nginx-mudhotech.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
mkdir -p /var/www/certbot

cat <<'NOTE'

──────────────────────────────────────────────────────────────────────
Provisioning done. Three things left, in this order:

1. POINT DNS AT THIS SERVER, and wait for it to propagate.
   At Namecheap → Domain List → mudhotech.com → Advanced DNS, replace the
   parking records with:

       A     @      66.29.139.201
       A     www    66.29.139.201

   Delete the existing CNAME on `www` (it points at parkingpage.namecheap.com)
   or the A record will not take effect.

   Confirm before continuing — certbot WILL fail if DNS has not moved:
       dig +short mudhotech.com     # must print 66.29.139.201

2. GET THE CERTIFICATE. The nginx config references cert files that do not
   exist yet, so `nginx -t` fails until this runs:

       certbot --nginx -d mudhotech.com -d www.mudhotech.com

3. FILL IN backend/.env — the mail credentials at minimum, or lead
   notifications go nowhere. Then:

       bash /srv/mudhotech/deploy/deploy.sh

──────────────────────────────────────────────────────────────────────
NOTE
