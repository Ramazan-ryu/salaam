#!/usr/bin/env sh
# Restore a backup made by backup.sh. DESTRUCTIVE for the target database: asks for confirmation.
#   infra/scripts/restore.sh backups/salaam_dev-YYYYMMDD-HHMMSS.dump [target_db]
set -eu
cd "$(dirname "$0")/../.."
FILE="${1:?usage: restore.sh <backup.dump> [target_db]}"
TARGET="${2:-salaam_dev}"
[ -f "$FILE" ] || { echo "No such file: $FILE"; exit 1; }
if [ "${CONFIRM:-}" != "yes" ]; then
  printf 'This replaces ALL data in database "%s". Type the database name to continue: ' "$TARGET"
  read -r answer
  [ "$answer" = "$TARGET" ] || { echo "Cancelled."; exit 1; }
fi
if docker compose ps --status running --services 2>/dev/null | grep -qx db; then
  docker compose exec -T db pg_restore -U salaam --clean --if-exists --no-owner -d "$TARGET" < "$FILE"
else
  : "${DATABASE_URL:?DATABASE_URL is required when the db container is not running}"
  BASE="${DATABASE_URL%/*}"
  # Extensions (PostGIS etc.) are created by the database administrator, not restored by the app user.
  LIST="$(mktemp)"
  pg_restore --list "$FILE" | grep -v -E ' EXTENSION |spatial_ref_sys' > "$LIST"
  pg_restore --clean --if-exists --no-owner --exit-on-error -L "$LIST" -d "$BASE/$TARGET" "$FILE"
  rm -f "$LIST"
fi
echo "Restored $FILE into $TARGET"
