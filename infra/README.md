# Module A — Infrastructure (infra/)

**Owner:** Dev 1  
**Stack:** Docker Compose + Nginx + PostgreSQL + Redis + OpenWA

---

## Responsibility

Sets up and documents all infrastructure. Everyone else depends on this being done first.

---

## Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| OpenWA | `ghcr.io/rmyndharis/openwa:latest` | 2785 | WhatsApp gateway |
| API | `./apps/api` (custom build) | 3000 | Bot backend |
| Web | `./apps/web` (custom build) | 80 (internal) | React dashboard |
| PostgreSQL | `postgres:16-alpine` | 5432 | Primary database |
| Redis | `redis:7-alpine` | 6379 | Cache + queues |
| Nginx | `nginx:alpine` | 80 | Reverse proxy |

---

## Local Dev (infra only)

Developers only need PostgreSQL, Redis, and OpenWA running locally. Their apps run on the host:

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- OpenWA on `localhost:2785`

---

## Production (full stack)

```bash
cp .env.example .env
# Fill in .env with real credentials

docker compose up -d --build
```

All services start. Nginx routes:
- `http://your-server/api/...` → API backend (port 3000)
- `http://your-server/webhook/...` → API webhook endpoint
- `http://your-server/` → React dashboard

---

## OpenWA Setup (First Time)

1. Access dashboard: `http://localhost:2785`
2. Create API key → copy to `.env` as `OPENWA_API_KEY`
3. Create session → name it `agrovet-bot`
4. Scan QR code with the shop's WhatsApp number
5. Set webhook: `http://api:3000/webhook/openwa` (within Docker network) or `http://host.docker.internal:3000/webhook/openwa` (dev)

> The QR code must be re-scanned after container restart unless sessions are persisted in the `openwa_sessions` volume.

---

## Nginx Config

File: `infra/nginx/nginx.conf`

Routes:
- `/api/` → proxied to API backend
- `/webhook/` → proxied to API webhook handler
- `/` → proxied to React web app

---

## Checklist for Module A

- [ ] `docker-compose.yml` tested (`docker compose up -d`)
- [ ] `docker-compose.dev.yml` tested
- [ ] `.env.example` complete (all vars documented)
- [ ] Nginx config routes all three paths correctly
- [ ] Prisma schema finalized and migrations run
- [ ] Seed script runs clean (`pnpm db:seed`)
- [ ] OpenWA session created + webhook URL set
- [ ] README updated with any deviations from the above
