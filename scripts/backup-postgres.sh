#!/usr/bin/env bash

set -Eeuo pipefail

compose_files=(-f compose.yaml -f compose.prod.yaml)
backup_dir="${BACKUP_DIR:-./backups}"
daily_retention_days="${BACKUP_RETENTION_DAYS:-7}"
weekly_retention_weeks="${BACKUP_RETENTION_WEEKS:-4}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
daily_backup_path="${backup_dir}/postgres_daily_${timestamp}.dump"

mkdir -p "$backup_dir"

docker compose "${compose_files[@]}" exec -T postgres \
  sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    --format=custom \
    --host=127.0.0.1 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB"' > "$daily_backup_path"

test -s "$daily_backup_path"

if [ "$(date -u +%u)" -eq 7 ]; then
  cp "$daily_backup_path" "${backup_dir}/postgres_weekly_${timestamp}.dump"
fi

find "$backup_dir" \
  -type f \
  -name 'postgres_daily_*.dump' \
  -mtime "+$daily_retention_days" \
  -delete

weekly_retention_days=$((weekly_retention_weeks * 7))

find "$backup_dir" \
  -type f \
  -name 'postgres_weekly_*.dump' \
  -mtime "+$weekly_retention_days" \
  -delete

printf 'Backup criado em %s\n' "$daily_backup_path"
