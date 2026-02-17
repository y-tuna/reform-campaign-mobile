#!/bin/bash

# Reform Campaign Manager - Database Backup & Restore Utility
# This script provides backup and restore functionality for the PostgreSQL database

set -e

# Default configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-reform_campaign}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-}

BACKUP_DIR=${BACKUP_DIR:-./backups}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        echo_info "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Backup database
backup_database() {
    local backup_type="$1"
    local backup_file=""
    
    create_backup_dir
    
    case "$backup_type" in
        "full"|"")
            backup_file="$BACKUP_DIR/reform_campaign_full_$TIMESTAMP.sql"
            echo_info "Creating full database backup..."
            pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$backup_file" --verbose
            ;;
        "schema")
            backup_file="$BACKUP_DIR/reform_campaign_schema_$TIMESTAMP.sql"
            echo_info "Creating schema-only backup..."
            pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -s -f "$backup_file" --verbose
            ;;
        "data")
            backup_file="$BACKUP_DIR/reform_campaign_data_$TIMESTAMP.sql"
            echo_info "Creating data-only backup..."
            pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -a -f "$backup_file" --verbose
            ;;
        *)
            echo_error "Invalid backup type: $backup_type"
            echo_error "Valid types: full, schema, data"
            exit 1
            ;;
    esac
    
    if [ -f "$backup_file" ]; then
        local file_size=$(du -h "$backup_file" | cut -f1)
        echo_success "Backup completed: $backup_file ($file_size)"
    else
        echo_error "Backup failed!"
        exit 1
    fi
}

# Restore database
restore_database() {
    local backup_file="$1"
    local restore_mode="$2"
    
    if [ ! -f "$backup_file" ]; then
        echo_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    echo_warning "This will restore database '$DB_NAME' from: $backup_file"
    
    if [ "$restore_mode" != "--force" ]; then
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo_info "Restore cancelled."
            exit 0
        fi
    fi
    
    echo_info "Restoring database..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$backup_file" --verbose
    
    echo_success "Database restore completed"
}

# List available backups
list_backups() {
    echo_info "Available backups in $BACKUP_DIR:"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo_warning "Backup directory does not exist: $BACKUP_DIR"
        return
    fi
    
    local backup_count=0
    for backup_file in "$BACKUP_DIR"/reform_campaign_*.sql; do
        if [ -f "$backup_file" ]; then
            local file_size=$(du -h "$backup_file" | cut -f1)
            local file_date=$(date -r "$backup_file" "+%Y-%m-%d %H:%M:%S")
            echo "  $(basename "$backup_file") ($file_size) - $file_date"
            backup_count=$((backup_count + 1))
        fi
    done
    
    if [ $backup_count -eq 0 ]; then
        echo_warning "No backup files found"
    else
        echo_info "Total backups found: $backup_count"
    fi
}

# Clean old backups
clean_old_backups() {
    local keep_days="${1:-7}"
    
    echo_info "Cleaning backups older than $keep_days days..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo_warning "Backup directory does not exist: $BACKUP_DIR"
        return
    fi
    
    local deleted_count=0
    while IFS= read -r -d '' backup_file; do
        echo_info "Deleted old backup: $(basename "$backup_file")"
        rm "$backup_file"
        deleted_count=$((deleted_count + 1))
    done < <(find "$BACKUP_DIR" -name "reform_campaign_*.sql" -type f -mtime +$keep_days -print0)
    
    if [ $deleted_count -eq 0 ]; then
        echo_info "No old backups to clean"
    else
        echo_success "Cleaned $deleted_count old backup(s)"
    fi
}

# Show database info
show_db_info() {
    echo_info "Database Information:"
    echo "  Host: $DB_HOST:$DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    
    # Check connection
    if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > /dev/null; then
        echo_success "Database is accessible"
        
        # Get database size
        local db_size=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT pg_size_pretty(pg_database_size('$DB_NAME'))")
        echo "  Size: $db_size"
        
        # Get table count
        local table_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")
        echo "  Tables: $table_count"
        
    else
        echo_error "Cannot connect to database"
    fi
}

# Help message
show_help() {
    echo "Reform Campaign Manager - Database Backup & Restore Utility"
    echo ""
    echo "Usage: $0 COMMAND [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  backup [TYPE]          Create database backup"
    echo "                         Types: full (default), schema, data"
    echo "  restore FILE [--force] Restore database from backup file"
    echo "  list                   List available backup files"
    echo "  clean [DAYS]           Remove backups older than DAYS (default: 7)"
    echo "  info                   Show database information"
    echo "  help                   Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DB_HOST          Database host (default: localhost)"
    echo "  DB_PORT          Database port (default: 5432)"
    echo "  DB_NAME          Database name (default: reform_campaign)"
    echo "  DB_USER          Database user (default: postgres)"
    echo "  DB_PASSWORD      Database password"
    echo "  BACKUP_DIR       Backup directory (default: ./backups)"
    echo ""
    echo "Examples:"
    echo "  $0 backup                           # Create full backup"
    echo "  $0 backup schema                    # Create schema-only backup"
    echo "  $0 restore backups/backup_file.sql  # Restore from backup"
    echo "  $0 list                             # List available backups"
    echo "  $0 clean 30                         # Remove backups older than 30 days"
}

# Main execution
case "$1" in
    "backup")
        backup_database "$2"
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo_error "Backup file required for restore"
            echo "Usage: $0 restore FILE [--force]"
            exit 1
        fi
        restore_database "$2" "$3"
        ;;
    "list")
        list_backups
        ;;
    "clean")
        clean_old_backups "$2"
        ;;
    "info")
        show_db_info
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo_error "Unknown command: $1"
        echo "Use '$0 help' to see available commands"
        exit 1
        ;;
esac