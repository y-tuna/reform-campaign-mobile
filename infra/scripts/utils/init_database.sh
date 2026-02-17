#!/bin/bash

# Reform Campaign Manager - Database Initialization Script
# This script sets up PostgreSQL database with PostGIS extension and runs migrations

set -e

# Default configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-reform_campaign}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-}

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

# Check if PostgreSQL is running
check_postgres() {
    echo_info "Checking PostgreSQL connection..."
    if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
        echo_success "PostgreSQL is running and accessible"
    else
        echo_error "Cannot connect to PostgreSQL at $DB_HOST:$DB_PORT"
        echo_error "Please ensure PostgreSQL is running and accessible"
        exit 1
    fi
}

# Create database if it doesn't exist
create_database() {
    echo_info "Checking if database '$DB_NAME' exists..."
    
    DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
    
    if [ "$DB_EXISTS" = "1" ]; then
        echo_warning "Database '$DB_NAME' already exists"
    else
        echo_info "Creating database '$DB_NAME'..."
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        echo_success "Database '$DB_NAME' created successfully"
    fi
}

# Enable PostGIS extension
enable_postgis() {
    echo_info "Enabling PostGIS extension..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS postgis;" > /dev/null
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" > /dev/null
    echo_success "PostGIS and uuid-ossp extensions enabled"
}

# Run Flyway migrations
run_migrations() {
    echo_info "Running database migrations..."
    
    if command -v flyway > /dev/null; then
        flyway -configFiles=./flyway.conf migrate
        echo_success "Migrations completed successfully"
    else
        echo_warning "Flyway not found. Running migrations manually..."
        
        # Run migration files manually
        for migration_file in ./flyway/migrations/V*.sql; do
            if [ -f "$migration_file" ]; then
                echo_info "Running migration: $(basename $migration_file)"
                psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration_file"
            fi
        done
        
        echo_success "Manual migrations completed"
    fi
}

# Run seed scripts
run_seeds() {
    if [ "$1" = "--with-seed" ] || [ "$1" = "-s" ]; then
        echo_info "Running seed scripts..."
        
        for seed_file in ./seed/*.sql; do
            if [ -f "$seed_file" ]; then
                echo_info "Running seed: $(basename $seed_file)"
                psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$seed_file"
            fi
        done
        
        echo_success "Seed scripts completed"
    else
        echo_info "Skipping seed scripts (use --with-seed or -s to include)"
    fi
}

# Verify database setup
verify_setup() {
    echo_info "Verifying database setup..."
    
    # Check if core tables exist
    TABLES_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")
    
    if [ "$TABLES_COUNT" -gt "0" ]; then
        echo_success "Database setup verified. Found $TABLES_COUNT tables."
        
        # Show table summary
        echo_info "Table summary:"
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
    else
        echo_error "Database verification failed. No tables found."
        exit 1
    fi
}

# Main execution
main() {
    echo_info "=== Reform Campaign Manager Database Initialization ==="
    echo_info "Target: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    
    check_postgres
    create_database
    enable_postgis
    run_migrations
    run_seeds "$1"
    verify_setup
    
    echo ""
    echo_success "=== Database initialization completed successfully! ==="
    echo_info "You can now connect to your database:"
    echo_info "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
}

# Help message
show_help() {
    echo "Reform Campaign Manager - Database Initialization Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --with-seed, -s    Include test seed data"
    echo "  --help, -h         Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DB_HOST           Database host (default: localhost)"
    echo "  DB_PORT           Database port (default: 5432)"
    echo "  DB_NAME           Database name (default: reform_campaign)"
    echo "  DB_USER           Database user (default: postgres)"
    echo "  DB_PASSWORD       Database password"
    echo ""
    echo "Examples:"
    echo "  $0                 # Initialize database without seed data"
    echo "  $0 --with-seed     # Initialize database with test seed data"
    echo "  DB_NAME=test $0 -s # Initialize test database with seed data"
}

# Handle command line arguments
case "$1" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        main "$1"
        ;;
esac