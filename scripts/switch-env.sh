#!/bin/bash
# ============================================================
# switch-env.sh — Switch between development and production
# ============================================================
# Usage:
#   ./scripts/switch-env.sh dev   → SQLite  + .env.development
#   ./scripts/switch-env.sh prod  → PostgreSQL + .env.production
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() { echo -e "${CYAN}→${NC} $1"; }
print_done() { echo -e "${GREEN}✅ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_err()  { echo -e "${RED}❌ $1${NC}"; }

cd "$PROJECT_DIR"

if [ -z "$1" ]; then
  echo ""
  echo "  🔄 Arch Code Engineer — Environment Switcher"
  echo "  ─────────────────────────────────────────────"
  echo ""
  echo "  Usage:  npm run env:dev    Switch to Development (SQLite)"
  echo "          npm run env:prod   Switch to Production  (PostgreSQL)"
  echo ""

  # Show current environment
  if [ -f .env ]; then
    if grep -q "sqlite" prisma/schema.prisma 2>/dev/null; then
      echo -e "  Current: ${GREEN}Development (SQLite)${NC}"
    elif grep -q "postgresql" prisma/schema.prisma 2>/dev/null; then
      echo -e "  Current: ${YELLOW}Production (PostgreSQL)${NC}"
    else
      echo -e "  Current: ${RED}Unknown${NC}"
    fi
  else
    echo -e "  Current: ${RED}No .env file found${NC}"
  fi

  echo ""
  exit 0
fi

ENV="$1"

case "$ENV" in
  dev|development)
    echo ""
    echo "  🔧 Switching to DEVELOPMENT (SQLite)"
    echo "  ─────────────────────────────────────"
    echo ""

    # 1. Copy schema
    print_step "Copying prisma/schema.dev.prisma → prisma/schema.prisma"
    cp prisma/schema.dev.prisma prisma/schema.prisma

    # 2. Copy env
    print_step "Copying .env.development → .env"
    cp .env.development .env

    # 3. Generate Prisma client
    print_step "Generating Prisma client..."
    npx prisma generate --schema=prisma/schema.prisma

    # 4. Push schema to SQLite (creates dev.db if missing)
    print_step "Pushing schema to SQLite database..."
    npx prisma db push --schema=prisma/schema.prisma

    echo ""
    print_done "Switched to DEVELOPMENT"
    echo ""
    echo "  Database: SQLite (prisma/dev.db)"
    echo "  Schema:   prisma/schema.prisma (SQLite)"
    echo "  Env:      .env (from .env.development)"
    echo ""
    echo "  Run:  npm run dev          Start dev server"
    echo "        npm run db:seed      Seed sample data"
    echo ""
    ;;

  prod|production)
    echo ""
    echo "  🚀 Switching to PRODUCTION (PostgreSQL)"
    echo "  ────────────────────────────────────────"
    echo ""

    # 1. Copy schema
    print_step "Copying prisma/schema.prod.prisma → prisma/schema.prisma"
    cp prisma/schema.prod.prisma prisma/schema.prisma

    # 2. Copy env
    print_step "Copying .env.production → .env"
    cp .env.production .env

    # 3. Check if DATABASE_URL is still placeholder
    if grep -q "USER:PASSWORD" .env 2>/dev/null; then
      echo ""
      print_warn "You still have placeholder values in .env.production!"
      print_warn "Edit .env.production with your real Neon credentials first:"
      echo ""
      echo "    DATABASE_URL=\"postgresql://user:pass@host/db?sslmode=require\""
      echo "    DIRECT_URL=\"postgresql://user:pass@host/db?sslmode=require\""
      echo "    NEXTAUTH_SECRET=\"your-strong-secret\""
      echo ""
      print_warn "After editing .env.production, run this command again."
      echo ""
      exit 1
    fi

    # 4. Generate Prisma client
    print_step "Generating Prisma client..."
    npx prisma generate --schema=prisma/schema.prisma

    # 5. Push schema to PostgreSQL
    print_step "Pushing schema to PostgreSQL database..."
    npx prisma db push --schema=prisma/schema.prisma

    echo ""
    print_done "Switched to PRODUCTION"
    echo ""
    echo "  Database: PostgreSQL (Neon)"
    echo "  Schema:   prisma/schema.prisma (PostgreSQL)"
    echo "  Env:      .env (from .env.production)"
    echo ""
    echo "  Run:  npm run build        Build for production"
    echo "        npm run start        Start production server"
    echo "        npm run db:seed      Seed initial data"
    echo ""
    ;;

  *)
    print_err "Unknown environment: $ENV"
    echo "  Use: dev | prod"
    exit 1
    ;;
esac

