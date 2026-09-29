# Ledger

Personal finance API. Tracks accounts, transactions, budgets, and spending
patterns using an append-only transaction ledger. Balances are always derived
from the ledger — never stored as mutable state.

## Prerequisites

- Node.js 20+ (use `nvm use` to switch)
- Docker and Docker Compose

## Setup

```bash
# 1. Start the database
docker compose up -d

# 2. Configure environment
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Run database migrations
npm run migrate:up

# 5. (Optional) Seed sample data
npm run seed

# 6. Start the dev server
npm run dev
```

The API will be available at http://localhost:3000.

## Available Scripts

| Script                             | Description                        |
| ---------------------------------- | ---------------------------------- |
| `npm run dev`                      | Start with auto-reload (nodemon)   |
| `npm start`                        | Start without auto-reload          |
| `npm run migrate:up`               | Apply pending migrations           |
| `npm run migrate:down`             | Roll back last migration           |
| `npm run migrate:create -- [name]` | Create a new migration file        |
| `npm run seed`                     | Populate database with sample data |

## Architecture

Three-layer architecture (routes → services → data access). Details will be
documented as layers are built out in Week 2.

## Core Domain Principle

**Balances are derived, never stored.** Every financial movement is an
immutable row in the transaction ledger. Account balances are computed by
summing transactions. This eliminates an entire class of data-integrity bugs
where balances drift out of sync with reality.

## Health Check

`GET /health` — returns `{"status": "ok"}` when the API and database are
connected.
