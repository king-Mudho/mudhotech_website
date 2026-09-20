#!/usr/bin/env bash
#
# Obtain the certificate and switch mudhotech.com from HTTP to HTTPS.
# Run AFTER provision.sh and deploy.sh, as root:
#
#   bash /srv/mudhotech/deploy/enable-tls.sh
#
# Uses `certbot certonly --webroot`, NOT `certbot --nginx`. The nginx plugin
# rewrites the config itself, which here would fight the hand-written TLS
# config and tends to leave a duplicated HTTP->HTTPS redirect — a redirect
# loop. webroot only writes the challenge file and leaves nginx alone.

set -euo pipefail

DOMAIN=mudhotech.com
APP_ROOT=/srv/mudhotech
WEBROOT=/var/www/certbot
EMAIL="${CERTBOT_EMAIL:-}"

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }

[[ $EUID -eq 0 ]] || { echo "Run as root."; exit 1; }

log "Pre-flight"
for host in "$DOMAIN" "www.$DOMAIN"; do
  ip=$(getent hosts "$host" | awk '{print $1; exit}')
  printf '  %-22s -> %s\n' "$host" "${ip:-UNRESOLVED}"
  [[ -n "$ip" ]] || { echo "  ! $host does not resolve. Fix DNS first."; exit 1; }
done

nginx -t || { echo "  ! nginx config is already broken — fix that before adding TLS."; exit 1; }

log "Checking the ACME challenge path is served over HTTP"
mkdir -p "$WEBROOT/.well-known/acme-challenge"
token="preflight-$(date +%s)"
echo "$token" > "$WEBROOT/.well-known/acme-challenge/$token"
got=$(curl -fsS --max-time 15 "http://$DOMAIN/.well-known/acme-challenge/$token" 2>/dev/null || echo "")
rm -f "$WEBROOT/.well-known/acme-challenge/$token"

if [[ "$got" != "$token" ]]; then
  echo "  ! Challenge path is not reachable over HTTP."
  echo "    The bootstrap vhost must be enabled and nginx reloaded first:"
  echo "      ls -l /etc/nginx/sites-enabled/$DOMAIN"
  echo "      nginx -t && systemctl reload nginx"
  exit 1
fi
echo "  Challenge path OK."

log "Requesting the certificate"
certbot certonly --webroot -w "$WEBROOT" \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos \
  ${EMAIL:+--email "$EMAIL"} ${EMAIL:---register-unsafely-without-email} \
  --keep-until-expiring

log "Installing the TLS config"
# Keep a copy of what is being replaced, so a bad swap is one command to undo.
cp "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-available/$DOMAIN.http.bak"
cp "$APP_ROOT/deploy/nginx-mudhotech.conf" "/etc/nginx/sites-available/$DOMAIN"

if nginx -t; then
  systemctl reload nginx
  log "TLS enabled."
else
  echo "  ! Config test failed — rolling back, nothing changed."
  cp "/etc/nginx/sites-available/$DOMAIN.http.bak" "/etc/nginx/sites-available/$DOMAIN"
  nginx -t && systemctl reload nginx
  exit 1
fi

log "Verifying"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://$DOMAIN/" || echo 000)
redirect=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://$DOMAIN/" || echo 000)
subject=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null \
          | openssl x509 -noout -subject 2>/dev/null || echo "?")

printf '  https://%s        HTTP %s\n' "$DOMAIN" "$code"
printf '  http  -> redirect      HTTP %s (expect 301)\n' "$redirect"
printf '  certificate            %s\n' "$subject"

log "Renewal"
systemctl list-timers 2>/dev/null | grep -q certbot \
  && echo "  certbot timer is active." \
  || echo "  ! No certbot timer found — check: systemctl enable --now certbot.timer"
