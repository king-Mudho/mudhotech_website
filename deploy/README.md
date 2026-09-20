# Deploying mudhotech.com

Target: `66.29.139.201`, root VPS, alongside the existing ABI and Digital
Portal sites.

Everything here is scoped to `mudhotech.com`. Nothing touches the other
sites' nginx server blocks — but `nginx -t` before every reload, because a
syntax error takes down *every* site on the box, not just this one.

---

## Shape of it

```
Browser ──443──► nginx ──► 127.0.0.1:3100  Next.js  (mudhotech-web.service)
                                │
                                └── server-to-server ──► 127.0.0.1:8100  Django
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

Installs Node 20, Python, nginx and certbot if missing; creates the
`mudhotech` service user; clones to `/srv/mudhotech`; generates a Django
secret key; installs the systemd units and the nginx site.

It checks for an existing Node before installing, so it will not downgrade a
runtime the other sites depend on.

### 3. Certificate

```bash
certbot --nginx -d mudhotech.com -d www.mudhotech.com
```

The nginx config references cert paths that do not exist until this runs, so
`nginx -t` fails before it. That is expected.

Certbot installs its own renewal timer. Confirm it:

```bash
systemctl list-timers | grep certbot
certbot renew --dry-run
```

### 4. Fill in the environment

```bash
nano /srv/mudhotech/backend/.env
```

`DJANGO_SECRET_KEY` is already generated. You need the mail credentials —
either `RESEND_API_KEY` (verify the domain in Resend first) or the SMTP
block.

Check `frontend/.env.production` too; the defaults should be right.

### 5. Deploy

```bash
bash /srv/mudhotech/deploy/deploy.sh
systemctl enable mudhotech-api mudhotech-web    # survive a reboot
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
curl -I http://127.0.0.1:3100/           # Next
curl -s http://127.0.0.1:8100/api/health/ # Django
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
