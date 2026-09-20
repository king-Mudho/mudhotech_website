# Deploying mudhotech.com

Target: `66.29.139.201` — **AlmaLinux 9**, root VPS, alongside the existing
ABI (`agribizframework.com`) and Digital Respondent sites.

RHEL-family, so `dnf` not `apt`, and nginx vhosts in `/etc/nginx/conf.d/`.

The box is busy. As surveyed on 2026-09-20:

| Port | Used by |
|---|---|
| 3000, 3100 | ABI / Digital Respondent (Next.js) |
| 8000, 8100 | their APIs |
| 5432 | PostgreSQL |
| 6379 | Redis |

mudhotech therefore uses **3200** (Next) and **8200** (Django). `provision.sh`
re-checks and aborts rather than racing an existing service for a port.

Two other platform facts that bite:

- **Python.** The system `python3` is 3.9; Django 6.0.8 needs >= 3.12.
  `provision.sh` installs `python3.12` alongside it and builds the venv with
  that. 3.9 stays as the system interpreter, so nothing else is affected.
- **SELinux is currently Disabled** on this box, so the `httpd_can_network_connect`
  step is skipped. The script still sets it when SELinux is on, because a
  rebuild would bring it back and the symptom (every `proxy_pass` returning
  502) points at completely the wrong thing.

Everything here is scoped to `mudhotech.com`. Nothing touches the other
sites' nginx server blocks — but `nginx -t` before every reload, because a
syntax error takes down *every* site on the box, not just this one.

---

## Shape of it

```
Browser ──443──► nginx ──► 127.0.0.1:3200  Next.js  (mudhotech-web.service)
                                │
                                └── server-to-server ──► 127.0.0.1:8200  Django
                                                          (mudhotech-api.service)
```

Django is bound to loopback deliberately. The browser is never supposed to
reach it directly — the Next.js Route Handlers hold the admin session token
and are the only front door. Binding Gunicorn to `0.0.0.0` would expose the
admin API and defeat Layer 1 of the model in
`docs/ARCHITECTURE-DEVIATION.md`.

---

## Before you start

Three things must be true, or the deploy fails part-way:

1. **The branch is pushed.** `provision.sh` clones from GitHub. Nothing
   deploys from a laptop.
2. **DNS points here.** Right now `mudhotech.com` resolves to
   `192.64.119.131` (Namecheap parking) and `www` is a CNAME to
   `parkingpage.namecheap.com`. Certbot will fail until that changes.
3. **You have mail credentials**, or lead notifications go nowhere. The
   submission still saves and still shows in the dashboard — but nobody is
   told it arrived, which for a lead-capture site is the whole point.

---

## First time

### 1. DNS — at Namecheap, before touching the server

Domain List → `mudhotech.com` → Advanced DNS:

| Type | Host | Value | 
|---|---|---|
| A | `@` | `66.29.139.201` |
| A | `www` | `66.29.139.201` |

Delete the existing `www` CNAME to `parkingpage.namecheap.com` first, or the
A record is ignored.

Leave the MX records alone unless you are moving mail — they currently point
at Namecheap email forwarding.

Wait for it, and verify:

```bash
dig +short mudhotech.com
```

Must print `66.29.139.201`. Namecheap is usually minutes, but allow an hour.

### 2. Provision

```bash
ssh root@66.29.139.201
curl -fsSL https://raw.githubusercontent.com/king-Mudho/mudhotech_website/main/deploy/provision.sh -o provision.sh
less provision.sh          # read it before running it as root
bash provision.sh
```

Installs Node 20, Python, nginx and certbot (via EPEL) if missing; creates
the `mudhotech` service user; clones to `/srv/mudhotech`; generates a Django
secret key; installs the systemd units; enables the HTTP vhost and reloads.

It checks for an existing Node first, so it will not downgrade a runtime ABI
depends on. It records where it put the vhost in `/etc/mudhotech-deploy.conf`
so `enable-tls.sh` writes to the same place.

**SELinux:** the script sets `httpd_can_network_connect`. Without it,
AlmaLinux denies nginx outbound TCP and *every* `proxy_pass` returns 502 with
"Permission denied ... upstream" in the error log — which looks exactly like
the app being down. If you ever see a 502 you cannot explain, check this
first:

```bash
getsebool httpd_can_network_connect     # must be "on"
```

### 3. Fill in the environment

```bash
nano /srv/mudhotech/backend/.env
```

`DJANGO_SECRET_KEY` is already generated. You need the mail credentials —
either `RESEND_API_KEY` (verify the domain in Resend first) or the SMTP
block.

Check `frontend/.env.production` too; the defaults should be right.

### 4. Deploy

```bash
bash /srv/mudhotech/deploy/deploy.sh
systemctl enable mudhotech-api mudhotech-web    # survive a reboot
```

`http://mudhotech.com` should now serve the site. Still plain HTTP — that is
the next step.

### 5. Turn on TLS

```bash
bash /srv/mudhotech/deploy/enable-tls.sh
```

**Do not run `certbot --nginx`.** The nginx plugin rewrites the config it
finds, which here collides with the hand-written TLS config and leaves a
duplicated HTTP→HTTPS redirect — a redirect loop. `enable-tls.sh` uses
`certbot certonly --webroot`, which only writes the challenge file and
leaves nginx alone, then swaps the config in and rolls back if `nginx -t`
fails.

Ordering is deliberate. The TLS config references
`/etc/letsencrypt/live/mudhotech.com/fullchain.pem`; enabling it before the
certificate exists makes `nginx -t` fail, and on a shared box that blocks
reloads for ABI and Digital Respondent too.

Confirm renewal is scheduled:

```bash
systemctl list-timers | grep certbot
certbot renew --dry-run
```

### 6. Create the admin account

```bash
cd /srv/mudhotech/backend
set -a && . ./.env && set +a
.venv/bin/python manage.py createsuperuser
```

**Do not copy the development `db.sqlite3` to this server.** It contains an
`admin` / `DevAdmin123!` account with a password that is written down in the
project README. On a public lead dashboard holding customer contact details,
that is a live account with a known password.

---

## Routine deploys

```bash
ssh root@66.29.139.201
bash /srv/mudhotech/deploy/deploy.sh
```

Pulls `main`, backs up the database, migrates, builds, restarts, health-checks.
Builds before restarting, so the site is never serving a half-written
`.next`.

---

## When something breaks

```bash
systemctl status mudhotech-web mudhotech-api
journalctl -u mudhotech-web -n 100 --no-pager
journalctl -u mudhotech-api -n 100 --no-pager
nginx -t && systemctl reload nginx

# Is each layer up?
curl -I http://127.0.0.1:3200/           # Next
curl -s http://127.0.0.1:8200/api/health/ # Django
curl -I https://mudhotech.com/            # through nginx
```

| Symptom | Usually |
|---|---|
| 502 from nginx | Next is down — `journalctl -u mudhotech-web` |
| Site loads, forms return 500 | Django is down or `.env` is malformed |
| Forms return 429 | The throttle doing its job: 10 submissions/hour/IP |
| Leads arrive but no email | No mail credentials in `backend/.env` |
| Admin login redirects in a loop | `DJANGO_ALLOWED_HOSTS` or `CORS_ALLOWED_ORIGINS` wrong |
| Certificate expired | `certbot renew --dry-run`, check the timer is enabled |
| 502, app is definitely running | SELinux — `getsebool httpd_can_network_connect` |

---

## Known limits

**SQLite.** Fine for the current volume — it is a single file on a
persistent disk, and `deploy.sh` snapshots it before every migration. It
handles concurrent *writes* poorly, so if form submissions ever become
frequent enough to overlap, move to Postgres. That is a `DATABASES` change
plus a migration run, not a rewrite.

**No off-server backup.** `deploy.sh` keeps local `.bak` copies next to the
database. Local copies do not survive losing the box. Add an off-site copy
of `/srv/mudhotech/backend/db.sqlite3` before this holds leads that matter.

**Placeholder content is not rendered, but it is still in the repo.** The
testimonials, partner logos, invented statistics, team profiles and
portfolio case studies are all switched off in the pages — see the comments
marking where each one was. `grep -rn "TODO(content)" frontend/src` finds
the data modules waiting for real content.
