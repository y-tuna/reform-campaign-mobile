#!/bin/bash

# Reform Campaign Manager - Migration Testing Script
# This script tests database migrations and validates schema integrity

set -e

# Default configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-reform_campaign_test}
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

# Test database connection
test_connection() {
    echo_info "Testing database connection..."
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT version();" > /dev/null 2>&1; then
        echo_success "Database connection successful"
    else
        echo_error "Cannot connect to PostgreSQL"
        echo_error "Please ensure PostgreSQL is running and accessible"
        exit 1
    fi
}

# Create test database
create_test_db() {
    echo_info "Creating test database: $DB_NAME"
    
    # Drop database if exists
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null 2>&1
    
    # Create fresh test database
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    echo_success "Test database created"
}

# Run migration test
test_migrations() {
    echo_info "Testing database migrations..."
    
    # Enable extensions
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS postgis;" > /dev/null
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" > /dev/null
    
    # Apply migration
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "./flyway/migrations/V1__Create_core_tables.sql" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo_success "Migration executed successfully"
    else
        echo_error "Migration failed"
        exit 1
    fi
}

# Validate schema
validate_schema() {
    echo_info "Validating database schema..."
    
    # Expected tables
    local expected_tables=(
        "users" "profiles" "pois" "tasks" "proofs" 
        "credits" "documents" "broadcasts" "education_content" 
        "policy_documents" "chatbot_knowledge_base"
    )
    
    local validation_failed=0
    
    # Check if all expected tables exist
    for table in "${expected_tables[@]}"; do
        local exists=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='$table')")
        if [ "$exists" = "t" ]; then
            echo_success "✓ Table '$table' exists"
        else
            echo_error "✗ Table '$table' missing"
            validation_failed=1
        fi
    done
    
    # Check enum types
    local expected_enums=(
        "user_role" "task_type" "task_tertiary" "task_status" 
        "proof_kind" "broadcast_severity" "profile_intensity" 
        "mobility_type" "credit_kind" "document_kind" "document_status" "poi_category"
    )
    
    for enum_type in "${expected_enums[@]}"; do
        local exists=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname='$enum_type')")
        if [ "$exists" = "t" ]; then
            echo_success "✓ Enum '$enum_type' exists"
        else
            echo_error "✗ Enum '$enum_type' missing"
            validation_failed=1
        fi
    done
    
    # Check PostGIS extension
    local postgis_exists=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname='postgis')")
    if [ "$postgis_exists" = "t" ]; then
        echo_success "✓ PostGIS extension enabled"
    else
        echo_error "✗ PostGIS extension missing"
        validation_failed=1
    fi
    
    # Check spatial indexes
    local spatial_indexes=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE '%_geom%'")
    if [ "$spatial_indexes" -gt "0" ]; then
        echo_success "✓ Spatial indexes created ($spatial_indexes found)"
    else
        echo_warning "! No spatial indexes found"
    fi
    
    if [ $validation_failed -eq 0 ]; then
        echo_success "Schema validation passed"
        return 0
    else
        echo_error "Schema validation failed"
        return 1
    fi
}

# Test seed data
test_seed_data() {
    echo_info "Testing seed data insertion..."
    
    # Apply seed data
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "./seed/01_seed_test_data.sql" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo_success "Seed data inserted successfully"
        
        # Verify data
        local user_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM users")
        local poi_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM pois")
        local task_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM tasks")
        
        echo_success "Seed data verification:"
        echo "  - Users: $user_count"
        echo "  - POIs: $poi_count" 
        echo "  - Tasks: $task_count"
    else
        echo_error "Seed data insertion failed"
        exit 1
    fi
}

# Test data integrity
test_data_integrity() {
    echo_info "Testing data integrity..."
    
    # Test foreign key constraints
    local fk_violations=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "
        SELECT COUNT(*) FROM (
            SELECT 'profiles' as table_name, id FROM profiles p WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.user_id)
            UNION ALL
            SELECT 'tasks', id FROM tasks t WHERE t.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = t.user_id)
            UNION ALL  
            SELECT 'proofs', id FROM proofs p WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.user_id)
        ) violations
    ")
    
    if [ "$fk_violations" = "0" ]; then
        echo_success "✓ Foreign key integrity verified"
    else
        echo_error "✗ Foreign key violations found: $fk_violations"
        return 1
    fi
    
    # Test enum constraints
    local enum_violations=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "
        SELECT COUNT(*) FROM users WHERE role NOT IN ('candidate', 'admin', 'viewer')
    ")
    
    if [ "$enum_violations" = "0" ]; then
        echo_success "✓ Enum constraints verified"
    else
        echo_error "✗ Enum constraint violations found: $enum_violations"
        return 1
    fi
    
    echo_success "Data integrity tests passed"
}

# Generate test report
generate_report() {
    echo_info "Generating test report..."
    
    local report_file="./test_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Reform Campaign Manager - Migration Test Report"
        echo "Generated: $(date)"
        echo "Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
        echo ""
        
        echo "=== Schema Information ==="
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
        echo ""
        
        echo "=== Table Row Counts ==="
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
            SELECT 
                schemaname,
                tablename,
                n_tup_ins as \"Rows\"
            FROM pg_stat_user_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        "
        echo ""
        
        echo "=== Index Information ==="
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
            SELECT 
                tablename,
                indexname,
                indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname;
        "
        
    } > "$report_file"
    
    echo_success "Test report generated: $report_file"
}

# Cleanup test database
cleanup_test_db() {
    if [ "$1" = "--keep-db" ]; then
        echo_info "Keeping test database for manual inspection"
        echo_info "Connect with: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
    else
        echo_info "Cleaning up test database..."
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null 2>&1
        echo_success "Test database cleaned up"
    fi
}

# Main test execution
run_tests() {
    echo_info "=== Reform Campaign Manager Migration Tests ==="
    echo_info "Test Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    
    test_connection
    create_test_db
    test_migrations
    validate_schema
    test_seed_data
    test_data_integrity
    generate_report
    
    echo ""
    echo_success "=== All tests completed successfully! ==="
    
    cleanup_test_db "$1"
}

# Help message
show_help() {
    echo "Reform Campaign Manager - Migration Testing Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --keep-db    Keep test database after tests for manual inspection"
    echo "  --help, -h   Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DB_HOST      Database host (default: localhost)"
    echo "  DB_PORT      Database port (default: 5432)"
    echo "  DB_NAME      Test database name (default: reform_campaign_test)"
    echo "  DB_USER      Database user (default: postgres)"
    echo "  DB_PASSWORD  Database password"
    echo ""
}

# Handle command line arguments
case "$1" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        run_tests "$1"
        ;;
esac