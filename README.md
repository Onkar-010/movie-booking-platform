# 🎬 Movie Booking Platform

A BookMyShow-inspired movie ticket booking platform, built backend-first as a **learning project** to deeply understand — and be able to defend — every design decision, from schema modeling to concurrency control.

---

## Why this project exists

The goal isn't a finished app. It's to make real engineering decisions and be able to explain the trade-offs behind them:

- Why is this a table and not a column?
- Why this locking strategy and not another?
- What happens when two users click the same seat in the same millisecond?

Design decisions are worked out one entity at a time and documented as the project evolves.

## Centerpiece: the seat lock / expiry state machine

The core problem this project focuses on is **concurrency control for seat booking**: many users competing for the same seat in the same show.

Seat state is tracked **per show** (not on the physical seat in the screen layout):

```
AVAILABLE ──hold──▶ HELD ──payment success──▶ BOOKED
    ▲                 │
    └──expiry/release─┘
```

- A seat is held for a limited time (`held_expires_at`) while the user pays.
- Holds must be acquired **atomically** — no check-then-update race conditions.
- The holder sees their own held seat as "selected"; everyone else sees it as unavailable (computed at the API layer, not stored).
- The design is kept modular so a second state layer (e.g. admin reservations) can be added later.

V1 explores the available concurrency strategies (PostgreSQL row-level locking such as `SELECT … FOR UPDATE` / `SKIP LOCKED` / `NOWAIT`, versus Redis-based locks) along with their limitations.

## MVP scope

**Customer**
- Browse movies → select a show → view seat map → hold seats → mock payment → confirm booking

**Theater admin**
- Create screen layout → add shows → set price

**Deferred (post-MVP)**
- Admin analytics, cancellations/refunds, dynamic pricing, real payment gateway, real notifications, caching

## Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL ([Neon](https://neon.tech) serverless) |
| ORM / migrations | [Drizzle ORM](https://orm.drizzle.team) + drizzle-kit |
| Auth | JWT *(planned)* |

## Project structure

```
movie-booking-platform/
└── backend/
    ├── doc/                  # Requirements and design docs
    ├── src/
    │   ├── config/
    │   │   ├── index.ts      # Env-driven app configuration
    │   │   └── dbConfig.ts   # Neon client + Drizzle instance + connectivity check
    │   ├── app.ts            # Express app (CORS, body parsing, health route)
    │   └── server.ts         # Entry point: verify DB connection, then start listening
    ├── package.json
    └── tsconfig.json
```

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)

### Setup

```bash
git clone https://github.com/Onkar-010/movie-booking-platform.git
cd movie-booking-platform/backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | – | Postgres connection string |
| `PORT` | no | `5000` | Port the API listens on |
| `CORS_ORIGIN` | no | `http://localhost:3000` | Allowed frontend origin |

### Run

```bash
npm run dev
```

On startup the server checks database connectivity (`SELECT 1`) and exits with an error if it can't connect. Then verify it's up:

```bash
curl http://localhost:5000/
# {"success":true,"message":"Server is running"}
```

## Author

**Onkar Pawar** — [@Onkar-010](https://github.com/Onkar-010)

## License

ISC
