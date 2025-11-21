#!/bin/bash
# Wrapper around the mysql CLI that prevents Bash from expanding characters
# such as "$" inside SQL statements (critical for bcrypt hashes).

set -euo pipefail
set -o noglob
IFS=$' \t\n'

usage() {
  cat <<'EOF'
Usage: scripts/mysql-safe.sh [mysql args...] [--sql "STATEMENT"]

Examples:
  # Pipe SQL from stdin (recommended for multi-line statements)
  cat <<'SQL' | scripts/mysql-safe.sh -u airicepest -p123456789 airicepest
  UPDATE users SET password_hash='$2b$12$example...' WHERE username='admin';
  SQL

  # Provide SQL via --sql argument (wrapper will escape $ automatically)
  scripts/mysql-safe.sh -u airicepest -p123456789 airicepest \
    --sql "UPDATE users SET password_hash='$2b$12$example...' WHERE id=1;"
EOF
}

SQL_PAYLOAD=""
MYSQL_ARGS=()
while (($#)); do
  case "$1" in
    --sql)
      shift || { echo "Error: --sql requires a value" >&2; exit 1; }
      SQL_PAYLOAD="$1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      MYSQL_ARGS+=("$1")
      ;;
  esac
  shift || break
done

if [[ ${#MYSQL_ARGS[@]} -eq 0 ]]; then
  echo "Error: pass normal mysql arguments before --sql (e.g. -u user -p dbname)" >&2
  usage
  exit 1
fi

if [[ -z "$SQL_PAYLOAD" ]]; then
  if [[ -t 0 ]]; then
    echo "Error: provide SQL via stdin (preferred) or --sql" >&2
    usage
    exit 1
  fi
  SQL_PAYLOAD="$(cat)"
fi

# Always write SQL to a tempfile so it is never interpreted by the shell.
TMP_SQL=$(mktemp)
trap 'rm -f "$TMP_SQL"' EXIT
printf '%s\n' "$SQL_PAYLOAD" > "$TMP_SQL"

mysql "${MYSQL_ARGS[@]}" < "$TMP_SQL"
