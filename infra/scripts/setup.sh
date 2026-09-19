#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# AgroVet POS — One-Shot Setup Script
# Run from the repo root:  bash infra/scripts/setup.sh
# ─────────────────────────────────────────────────────────────────────────────

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}🚜 AgroVet POS — Setup${NC}\n"

# ── Step 1: Check prerequisites ─────────────────────────────────────────────
echo -e "${BOLD}[1/7] Checking prerequisites...${NC}"

check_cmd() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}✗ $1 is not installed.${NC} $2"
    exit 1
  else
    echo -e "${GREEN}✓${NC} $1 found: $($1 --version 2>/dev/null | head -1)"
  fi
}

check_cmd "node" "Install from https://nodejs.org (v20+)"
check_cmd "pnpm" "Run: npm install -g pnpm"
check_cmd "docker" "Install Docker Desktop from https://docker.com"

# Check Node version >= 20
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo -e "${RED}✗ Node.js v20+ required (found v$(node -v))${NC}"
  exit 1
fi

echo ""

# ── Step 2: Create .env from template ────────────────────────────────────────
echo -e "${BOLD}[2/7] Setting up environment variables...${NC}"

if [ ! -f .env ]; then
  cp infra/.env.example .env
  echo -e "${GREEN}✓${NC} Created .env from infra/.env.example"
  echo -e "${YELLOW}  ⚠  Edit .env with your KRA sandbox credentials before going to production${NC}"
else
  echo -e "${GREEN}✓${NC} .env already exists (skipping)"
fi

echo ""

# ── Step 3: Install Node dependencies ────────────────────────────────────────
echo -e "${BOLD}[3/7] Installing Node.js dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# ── Step 4: Start Docker services ────────────────────────────────────────────
echo -e "${BOLD}[4/7] Starting Docker services (PostgreSQL, Redis, OpenWA)...${NC}"
docker compose -f infra/docker-compose.dev.yml up -d
echo -e "${GREEN}✓${NC} Docker services started"
echo ""

# ── Step 5: Wait for PostgreSQL to be ready ──────────────────────────────────
echo -e "${BOLD}[5/7] Waiting for PostgreSQL to be ready...${NC}"
RETRIES=30
until docker exec agrovet-postgres-dev pg_isready -U postgres > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "  Waiting for PostgreSQL... ($RETRIES attempts left)"
  RETRIES=$((RETRIES-1))
  sleep 1
done

if [ $RETRIES -eq 0 ]; then
  echo -e "${RED}✗ PostgreSQL failed to start. Check: docker logs agrovet-postgres-dev${NC}"
  exit 1
fi
echo -e "${GREEN}✓${NC} PostgreSQL is ready"
echo ""

# ── Step 6: Run database migrations ─────────────────────────────────────────
echo -e "${BOLD}[6/7] Running database migrations and generating Prisma client...${NC}"
pnpm db:generate
pnpm db:migrate
echo -e "${GREEN}✓${NC} Database migrated"
echo ""

# ── Step 7: Seed demo data ──────────────────────────────────────────────────
echo -e "${BOLD}[7/7] Seeding demo data...${NC}"
pnpm db:seed
echo -e "${GREEN}✓${NC} Demo data seeded"
echo ""

# ── Done ─────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${GREEN}  ✅ Setup complete!${NC}"
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Services running:${NC}"
echo -e "    PostgreSQL   → localhost:5432"
echo -e "    Redis        → localhost:6379"
echo -e "    OpenWA       → http://localhost:2785"
echo ""
echo -e "  ${BOLD}Next steps:${NC}"
echo -e "    1. Start API:        ${YELLOW}pnpm --filter @agrovet/api dev${NC}"
echo -e "    2. Start Web:        ${YELLOW}pnpm --filter @agrovet/web dev${NC}"
echo -e "    3. Open OpenWA:      http://localhost:2785"
echo -e "       → Create API key → paste into .env as OPENWA_API_KEY"
echo -e "       → Create session 'agrovet-bot' → scan QR with WhatsApp"
echo -e "       → Set webhook: http://host.docker.internal:3000/webhook/openwa"
echo ""
echo -e "  ${BOLD}Demo login:${NC}"
echo -e "    Email:    owner@kilimo.co.ke"
echo -e "    Password: password123"
echo ""
