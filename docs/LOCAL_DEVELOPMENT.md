# Local Development — start guide (for non-programmers too)

## Option A — everything in Docker (recommended to just look at the product)

1. Install **Docker Desktop** (Windows/macOS) or Docker Engine (Linux). Free for personal use and small companies — check Docker's licence if the company grows.
2. Download the project folder and open a terminal in it.
3. Run **one command**:

   ```bash
   docker compose --profile full up --build -d
   ```

   (With `make` installed — macOS/Linux — the same thing is `make up`.)
   The first start takes a few minutes (downloads and builds). Later starts take seconds.
4. Open:

| What | Address | Notes |
|---|---|---|
| Salaam app (public) | http://localhost:3000 | Avatar home, Discover, event pages. Shows **sample** events (marked "Nümunə") |
| Staff portal | http://localhost:3000/staff | Review queue, manual entry, organizer form. Development sign-in: pick a role in the header |
| API health | http://localhost:4000/v1/health | Should say `{"status":"ok","db":"ok"}` |
| Database browser (optional) | http://localhost:8080 | Start with `docker compose --profile tools up -d`; server `db`, user/password `salaam` |

5. Check status: `docker compose --profile full ps` (all should be "healthy"). Logs: `docker compose --profile full logs -f api web`.
6. Stop: `docker compose --profile full down` (your data is kept).

## Option B — developer mode (faster changes)

Requires Node.js 22+, pnpm 10 (`corepack enable`), and Docker for the database.

```bash
cp .env.example .env            # Windows PowerShell: Copy-Item .env.example .env
pnpm install
pnpm --filter @salaam/domain build
docker compose up -d db         # database only
pnpm db:migrate && pnpm db:seed
pnpm dev:api                    # terminal 1 → http://localhost:4000
pnpm dev:web                    # terminal 2 → http://localhost:3000
```

Tests need the test database (created automatically by Docker's init script):

```bash
# macOS/Linux
DATABASE_URL=postgres://salaam:salaam@localhost:5432/salaam_test pnpm --filter @salaam/api exec ts-node --transpile-only src/db/migrate.ts
pnpm test
# Windows PowerShell
$env:DATABASE_URL="postgres://salaam:salaam@localhost:5432/salaam_test"; pnpm --filter @salaam/api exec ts-node --transpile-only src/db/migrate.ts; Remove-Item Env:DATABASE_URL
pnpm test
```

## Backups

| Task | macOS/Linux | Windows |
|---|---|---|
| Back up | `make backup` | `docker compose exec -T db pg_dump -U salaam -Fc salaam_dev > backups\salaam_dev.dump` |
| Restore | `make restore FILE=backups/<file>.dump` | `Get-Content backups\salaam_dev.dump -AsByteStream \| docker compose exec -T db pg_restore -U salaam --clean --if-exists --no-owner -d salaam_dev` |
| Wipe local data | `make reset` (asks to confirm) | `docker compose --profile full down -v` |

## Mobile (from stage S2)

The Android/iOS app does not exist yet. When it does: Expo Go on a physical phone on the same Wi-Fi, with the
API reachable at your computer's LAN address. The compose file binds to 127.0.0.1 on purpose, so phone testing
will use the natively started API (`pnpm dev:api` listens on all interfaces) or a tunnel. iOS simulators need macOS; they cannot run in Docker.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `port is already allocated` | Something else uses 3000/4000/5432. Stop it, or change the left-hand port in `compose.yaml` |
| Web shows "Couldn't load data" | `docker compose --profile full ps` — is `api` healthy? Then `logs api` |
| `migrate` exited with an error | `docker compose --profile full logs migrate` — usually the database volume is from an older incompatible version: back up, then `make reset` |
