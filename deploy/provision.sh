#!/usr/bin/env bash
#
# First-time server setup for mudhotech.com.
# Run ONCE, as root, on 66.29.139.201 (AlmaLinux 9).
#
#   bash provision.sh
#
# This box already hosts other sites (ABI on agribizframework.com, and
# Digital Respondent). Everything here is additive and scoped to
# mudhotech.com. It does not touch their nginx server blocks, does not
# downgrade a runtime they may depend on, and does not reconfigure the
# firewall — 80/443 are already open or ABI would not be reachable, and
# changing firewalld blind could cut off your own SSH session.

set -euo pipefail

APP_USER=mudhotech
APP_ROOT=/srv/mudhotech
REPO=https://github.com/king-Mudho/mudhotech_website.git
BRANCH=main
DOMAIN=mudhotech.com
WEB_PORT=3100
API_PORT=8100

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
die() { printf '\n\033[1;31m!!\033[0m %s\n' "$1"; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root."

# ─── 0. Confirm the platform ─────────────────────────────────────────────
# This script is RHEL-family (dnf, /etc/nginx/conf.d, SELinux). It was
# originally written for Debian and would have failed on the first
# apt-get; the box turned out to be AlmaLinux 9.
log "Platform"
. /etc/os-release
echo "  $PRETTY_NAME"
command -v dnf >/dev/null || die "No dnf found — this script targets AlmaLinux/RHEL 9."

# ─── 1. Survey what is already here ──────────────────────────────────────
log "What is already on this box"
nginx -v 2>&1 | sed 's/^/  /' || echo "  nginx: not installed"
printf '  node:    %s\n' "$(node --version 2>/dev/null || echo 'not installed')"
printf '  python3: %s\n' "$(python3 --version 2>/dev/null || echo 'not installed')"
printf '  selinux: %s\n' "$(getenforce 2>/dev/null || echo 'not present')"

# ─── 2. Ports ────────────────────────────────────────────────────────────
# ABI is a Next.js app and will be holding the default 3000, so this stack
# uses 3100/8100. Verify rather than assume: the failure mode is one
# service silently refusing to start on EADDRINUSE.
log "Checking ports $WEB_PORT and $API_PORT are free"
ss -ltnp 2>/dev/null | awk 'NR>1 {print "    " $4}' | sort -u | head -20
for port in "$WEB_PORT" "$API_PORT"; do
  if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${port}\$"; then
    die "Port ${port} is in use. Pick free ports and change them in:
       deploy/nginx-mudhotech.conf      (proxy_pass)
       deploy/nginx-mudhotech-http.conf (proxy_pass)
       deploy/mudhotech-web.service     (Environment=PORT)
       deploy/mudhotech-api.service     (--bind)
       frontend/.env.production         (INTERNAL_API_URL)"
  fi
  echo "  port ${port}: free"
done

# ─── 3. Packages ─────────────────────────────────────────────────────────
log "Installing packages"
dnf install -y -q git curl nginx python3 python3-pip || die "dnf install failed"

# certbot lives in EPEL on AlmaLinux 9.
if ! command -v certbot >/dev/null; then
  log "Installing certbot (via EPEL)"
  dnf install -y -q epel-release
  dnf install -y -q certbot
fi

# Node. ABI already runs a Next.js app, so node is almost certainly here —
# only install if missing or older than 20, and never downgrade.
if command -v node >/dev/null && [[ "$(node -v | sed 's/^v//' | cut -d. -f1)" -ge 20 ]]; then
  log "Node $(node -v) already present — leaving it alone"
else
  log "Installing Node.js 20"
  dnf module reset -y -q nodejs || true
  dnf module enable -y -q nodejs:20 || true
  dnf install -y -q nodejs || die "Node install failed"
fi

NPM_BIN=$(command -v npm) || die "npm not on PATH after install."
echo "  npm at $NPM_BIN"

# ─── 4. Service user and code ────────────────────────────────────────────
log "Service user '$APP_USER'"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /sbin/nologin "$APP_USER"

log "Cloning into $APP_ROOT"
if [[ -d "$APP_ROOT/.git" ]]; then
  echo "  Already cloned — pulling instead."
  git -C "$APP_ROOT" fetch origin "$BRANCH" -q
  git -C "$APP_ROOT" reset --hard "origin/$BRANCH" -q
else
  mkdir -p "$APP_ROOT"
  git clone -q --branch "$BRANCH" "$REPO" "$APP_ROOT"
fi
chown -R "$APP_USER:$APP_USER" "$APP_ROOT"

log "Python virtualenv + dependencies"
sudo -u "$APP_USER" python3 -m venv "$APP_ROOT/backend/.venv"
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q --upgrade pip
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q -r "$APP_ROOT/backend/requirements.txt"
# Gunicorn is the production server; not in requirements.txt because local
# development does not need it.
sudo -u "$APP_USER" "$APP_ROOT/backend/.venv/bin/pip" install -q gunicorn

# ─── 5. Environment ──────────────────────────────────────────────────────
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

# ─── 6. systemd ──────────────────────────────────────────────────────────
log "systemd units"
cp "$APP_ROOT/deploy/mudhotech-api.service" /etc/systemd/system/
cp "$APP_ROOT/deploy/mudhotech-web.service" /etc/systemd/system/
# The unit hardcodes /usr/bin/npm; on AlmaLinux it can be elsewhere.
sed -i "s|ExecStart=/usr/bin/npm|ExecStart=${NPM_BIN}|" /etc/systemd/system/mudhotech-web.service
systemctl daemon-reload

# ─── 7. SELinux ──────────────────────────────────────────────────────────
# AlmaLinux ships SELinux enforcing. Without this boolean, nginx is denied
# outbound TCP and every proxy_pass returns 502 with
# "Permission denied ... upstream" in the error log — which looks exactly
# like the app being down, and costs an hour to diagnose.
if command -v getenforce >/dev/null && [[ "$(getenforce)" != "Disabled" ]]; then
  log "SELinux: allowing nginx to connect to the app ports"
  setsebool -P httpd_can_network_connect 1
  echo "  httpd_can_network_connect = on"
fi

# ─── 8. nginx ────────────────────────────────────────────────────────────
# RHEL-family nginx includes /etc/nginx/conf.d/*.conf. Some setups also add
# the Debian-style sites-available/sites-enabled pair; detect which this box
# actually uses rather than assuming.
log "nginx site (HTTP bootstrap)"
if [[ -d /etc/nginx/sites-enabled ]] && grep -qs 'sites-enabled' /etc/nginx/nginx.conf; then
  NGINX_AVAIL="/etc/nginx/sites-available/$DOMAIN"
  NGINX_LINK="/etc/nginx/sites-enabled/$DOMAIN"
  mkdir -p /etc/nginx/sites-available
  echo "  Using sites-available/sites-enabled"
else
  NGINX_AVAIL="/etc/nginx/conf.d/$DOMAIN.conf"
  NGINX_LINK=""
  echo "  Using conf.d (RHEL default)"
fi

# The HTTP-only config goes in first. The TLS config points at certificate
# files that do not exist until certbot has run, and an enabled config
# referencing a missing cert makes `nginx -t` fail — which blocks reloads
# for every site on this box, ABI included. enable-tls.sh swaps it later.
mkdir -p /var/www/certbot
cp "$APP_ROOT/deploy/nginx-mudhotech-http.conf" "$NGINX_AVAIL"
[[ -n "$NGINX_LINK" ]] && ln -sf "$NGINX_AVAIL" "$NGINX_LINK"

# Record where it went, so enable-tls.sh writes to the same place.
printf 'NGINX_AVAIL=%s\nNGINX_LINK=%s\n' "$NGINX_AVAIL" "$NGINX_LINK" > /etc/mudhotech-deploy.conf

if nginx -t; then
  systemctl enable -q --now nginx 2>/dev/null || true
  systemctl reload nginx
  echo "  nginx reloaded with the HTTP bootstrap vhost."
else
  echo "  ! nginx config test FAILED — removing the vhost so the other sites"
  echo "    on this box keep working."
  rm -f "$NGINX_AVAIL"; [[ -n "$NGINX_LINK" ]] && rm -f "$NGINX_LINK"
  nginx -t && systemctl reload nginx
  die "Stopped without changing anything."
fi

cat <<NOTE

──────────────────────────────────────────────────────────────────────
Provisioning done. Three steps left, in this order:

1. MAIL CREDENTIALS — without them a lead still saves and still shows in
   the dashboard, but nobody is told it arrived:

       nano $APP_ROOT/backend/.env

2. DEPLOY, so something is listening on $WEB_PORT:

       bash $APP_ROOT/deploy/deploy.sh
       systemctl enable mudhotech-api mudhotech-web

   http://$DOMAIN should then serve the site.

3. TLS. Do NOT run 'certbot --nginx' — it rewrites the config and
   collides with the hand-written one, giving a redirect loop:

       bash $APP_ROOT/deploy/enable-tls.sh

Then create the admin account:

       cd $APP_ROOT/backend
       set -a && . ./.env && set +a
       .venv/bin/python manage.py createsuperuser
──────────────────────────────────────────────────────────────────────
NOTE
