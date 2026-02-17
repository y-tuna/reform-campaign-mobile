# Reform Campaign Manager - Database Setup

This directory contains database migration scripts, seed data, and utilities for the Reform Campaign Manager project.

## Structure

```
infra/scripts/
├── flyway/
│   └── migrations/
│       └── V1__Create_core_tables.sql    # Core database schema
├── seed/
│   └── 01_seed_test_data.sql             # Test data for development
├── utils/
│   ├── init_database.sh                  # Database initialization script
│   ├── backup_restore.sh                 # Backup and restore utilities
│   └── test_migrations.sh                # Migration testing script
├── flyway.conf                           # Flyway configuration
└── README.md                             # This file
```

## Quick Start

### 1. Initialize Database

Run the initialization script to set up your PostgreSQL database:

```bash
# Initialize database without seed data
cd infra/scripts
./utils/init_database.sh

# Initialize database with test seed data
./utils/init_database.sh --with-seed
```

### 2. Test Migrations

Validate your database schema and migrations:

```bash
# Run migration tests
./utils/test_migrations.sh

# Run tests and keep test database for inspection
./utils/test_migrations.sh --keep-db
```

### 3. Backup and Restore

```bash
# Create a full backup
./utils/backup_restore.sh backup

# Create schema-only backup
./utils/backup_restore.sh backup schema

# List available backups
./utils/backup_restore.sh list

# Restore from backup
./utils/backup_restore.sh restore backups/backup_file.sql
```

## Database Schema

The database schema includes the following core tables:

### User Management
- **users** - Core user authentication and roles
- **profiles** - Extended user profiles and campaign preferences

### Campaign Activities
- **tasks** - Campaign activities and routes
- **pois** - Points of Interest with geospatial data
- **proofs** - Evidence uploads with GPS/time metadata

### Content Management
- **documents** - Campaign documents and submissions
- **broadcasts** - System announcements and notifications
- **education_content** - Learning materials and guides
- **policy_documents** - Election law and regulatory information
- **chatbot_knowledge_base** - Q&A knowledge base

### Credit System
- **credits** - Campaign credit tracking and rewards

## Data Contracts

The schema enforces the following data contracts as defined in the project architecture:

### Task Types
- `Task.type`: poi-visit | facility-visit | doc-check | ad-purchase
- `Task.tertiary`: defer | proof | nav | open
- `Task.status`: planned | started | done | failed

### Proof Types
- `Proof.kind`: photo | receipt

### Broadcast Severity
- `Broadcast.severity`: info | warn | critical

### Profile Settings
- `Profile.intensity`: hard | normal | light
- `Profile.mobility`: car | pickup | trike | bike | walk

### Document Types
- `Document.kind`: nomination | nec_form
- `Document.status`: draft | submitted | reviewed | transferred

### Credit Types
- `Credit.kind`: in | out | hold

## Environment Variables

Configure your database connection using these environment variables:

```bash
# Database connection
DB_HOST=localhost          # Database host
DB_PORT=5432              # Database port  
DB_NAME=reform_campaign   # Database name
DB_USER=postgres          # Database user
DB_PASSWORD=              # Database password

# Backup settings
BACKUP_DIR=./backups      # Backup directory
```

## Development Workflow

### 1. Schema Changes

When making schema changes:

1. Create a new migration file in `flyway/migrations/`
2. Follow naming convention: `V{version}__{description}.sql`
3. Test the migration using `test_migrations.sh`
4. Update seed data if necessary

### 2. Adding Test Data

To add new test data:

1. Edit `seed/01_seed_test_data.sql`
2. Follow existing patterns for data insertion
3. Maintain referential integrity
4. Test with `test_migrations.sh --keep-db`

### 3. Production Deployment

For production deployment:

1. Backup existing database
2. Test migrations on staging environment
3. Apply migrations using Flyway
4. Verify schema integrity

## PostGIS Integration

The database uses PostGIS for geospatial functionality:

- **POIs** table has `geom` column for location data
- **Proofs** table stores GPS coordinates for evidence
- Spatial indexes are automatically created
- Distance calculations for scheduling algorithms

## Security Considerations

- User passwords are handled by authentication service (not stored in DB)
- Sensitive data uses appropriate field encryption
- Row-level security can be implemented for multi-tenancy
- Audit logging is built into the schema design

## Troubleshooting

### Connection Issues
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432 -U postgres

# Test connection
psql -h localhost -p 5432 -U postgres -d reform_campaign -c "SELECT version();"
```

### Migration Issues
```bash
# Check migration status
./utils/test_migrations.sh

# Manual migration rollback (if needed)
psql -h localhost -p 5432 -U postgres -d reform_campaign -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Performance Issues
```bash
# Check table sizes
psql -h localhost -p 5432 -U postgres -d reform_campaign -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(tablename::text) DESC;"

# Check index usage
psql -h localhost -p 5432 -U postgres -d reform_campaign -c "
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;"
```

## Support

For database-related issues:
1. Check the logs using the scripts provided
2. Review the migration test results
3. Verify environment variables are set correctly
4. Consult the project architecture documentation