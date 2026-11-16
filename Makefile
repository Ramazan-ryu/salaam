# Salaam developer commands. Windows: run the same `docker compose` / `pnpm` commands shown here
# directly in PowerShell (see docs/LOCAL_DEVELOPMENT.md), or use WSL2.
.DEFAULT_GOAL := help
COMPOSE := docker compose

help: ## List commands
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*## "}{printf "  make %-12s %s\n", $$1, $$2}'

setup: ## First-time setup for native development (copies .env, installs, builds shared code)
	@test -f .env || cp .env.example .env
	pnpm install
	pnpm --filter @salaam/domain build

up: ## Start everything in Docker (db + migrate/seed + api + web)
	$(COMPOSE) --profile full up --build -d
	@echo "Web: http://localhost:3000   Staff: http://localhost:3000/staff   API: http://localhost:4000/v1/health"

db: ## Start only the database (then run api/web natively: make dev-api / make dev-web)
	$(COMPOSE) up -d db

tools: ## Start Adminer database browser on http://localhost:8080
	$(COMPOSE) --profile tools up -d

down: ## Stop all containers (data is kept)
	$(COMPOSE) --profile full --profile tools --profile storage down

ps: ## Show container status and health
	$(COMPOSE) --profile full --profile tools --profile storage ps

logs: ## Follow logs of api and web
	$(COMPOSE) --profile full logs -f --tail=100 api web

health: ## Check API and web are answering
	@curl -fsS http://localhost:4000/v1/health && echo && curl -fsS -o /dev/null -w "web %{http_code}\n" http://localhost:3000/

dev-api: ## Run the API natively with reload-free ts-node (needs `make db`)
	pnpm dev:api

dev-web: ## Run the web app natively (needs the API)
	pnpm dev:web

migrate: ## Apply database migrations (native)
	pnpm db:migrate

seed: ## Seed reference + sample data (native)
	pnpm db:seed

test: ## Run all tests (API tests need a migrated *_test database)
	pnpm test

check: ## Typecheck and build everything
	pnpm typecheck && pnpm build

backup: ## Back up the dev database to ./backups
	infra/scripts/backup.sh

restore: ## Restore a backup: make restore FILE=backups/....dump (asks for confirmation)
	infra/scripts/restore.sh $(FILE)

reset: ## DELETE the local Docker database volume and start fresh (asks for confirmation)
	@printf 'This deletes ALL local Docker data (database volume). Type "reset" to continue: '; read a; [ "$$a" = "reset" ]
	$(COMPOSE) --profile full --profile tools --profile storage down -v

.PHONY: help setup up db tools down ps logs health dev-api dev-web migrate seed test check backup restore reset
