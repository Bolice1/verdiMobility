# verdiMobility API

Production-oriented logistics backend (Express, PostgreSQL, JWT, Zod, Winston).

## Requirements

- Node.js 20+ (LTS)
- PostgreSQL 14+

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET (each ≥32 chars)
```

Create database and apply schema (one-time on a fresh database):

```bash
createdb verdimobility
# Or: psql -U postgres -c "CREATE DATABASE verdimobility;"
npm run db:schema
```

Optional admin user (hash a password with bcrypt externally, or temporarily register a user, promote in SQL):

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## Run

```bash
# development (file watcher)
npm run dev

# production
NODE_ENV=production npm start
```

Health check: `GET http://localhost:4000/health`

API base: `http://localhost:4000/api`

## PostgreSQL connection

`DATABASE_URL` format:

`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

Example: `postgresql://postgres:postgres@localhost:5432/verdimobility`

For managed cloud databases, append SSL params as required by the provider (often `?sslmode=require`).

## Schema note

`users.company_id` links `company` role accounts to a company row (needed for fleet scoping). It is nullable for `user` and `driver` roles.

## Security defaults

- Helmet security headers
- Global rate limiting (`RATE_LIMIT_*` in `.env`)
- CORS via `CORS_ORIGIN` (comma-separated origins or `*`)
- Zod validation on inputs
- Parameterized SQL only (`pg`)
- Central error handler; no stack traces in production responses

## Main endpoints

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register` | Roles: `user`, `driver`, `company` (not `admin`) |
| POST | `/api/auth/login` | |
| POST | `/api/auth/refresh` | Body: `{ "refreshToken" }` |
| GET | `/api/users/me` | Bearer access token |
| GET | `/api/users` | Admin; pagination `?limit=&offset=` |
| POST | `/api/shipments` | Sender (`user` or `admin`) |
| GET | `/api/shipments` | Role-scoped list |
| GET | `/api/shipments/:id` | |
| PATCH | `/api/shipments/:id/status` | |
| POST | `/api/companies` | Admin, or `company` user without `company_id` yet |
| POST | `/api/vehicles` | Admin or owning `company` |
| GET | `/api/vehicles` | Admin (optional `companyId`), `company`, or `driver` |
| PATCH | `/api/vehicles/:id` | |
| POST | `/api/matching/run` | Admin or `company`; body optional `shipmentId`, `limit` |
| POST | `/api/ratings` | Sender or admin; body `{ shipmentId, rating, review? }` |
| GET | `/api/ratings/drivers/:driverId` | Authenticated; list ratings + average |
| PATCH | `/api/shipments/:id/impact` | Admin; set `distanceKm`, `baselineDistanceKm`, `fuelSavedLiters`, `co2SavedKg` |
| GET | `/api/analytics/impact` | Admin/company; aggregate CO₂/fuel/distance stats |

Matching assigns `pending` shipments to `available` vehicles with sufficient capacity; if the vehicle has prior deliveries, destination similarity is required (historical `shipments.destination`). New vehicles with no history can still match (cold start).
