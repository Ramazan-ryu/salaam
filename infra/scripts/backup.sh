#!/usr/bin/env sh
# Create a compressed backup of the local development database into ./backups/.
# Uses the Docker `db` service when it is running, otherwise a native pg_dump with $DATABASE_URL.
set -eu
cd "$(dirname "$0")/../.."
mkdir -p backups
DB_NAME="${DB_NAME:-salaam_dev}"
OUT="backups/${DB_NAME}-$(date +%Y%m%d-%H%M%S).dump"
if docker compose ps --status running --services 2>/dev/null | grep -qx db; then
  docker compose exec -T db pg_dump -U salaam -Fc "$DB_NAME" > "$OUT"
else
  : "${DATABASE_URL:?DATABASE_URL is required when the db container is not running}"
  pg_dump -Fc "$DATABASE_URL" > "$OUT"
fi
# A backup that cannot be read is not a backup: list its contents as a check.
pg_restore --list "$OUT" > /dev/null 2>&1 || docker compose exec -T db pg_restore --list < "$OUT" > /dev/null
echo "Backup written: $OUT ($(du -h "$OUT" | cut -f1))"
