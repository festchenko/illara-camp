# Render PostgreSQL Setup

## Manual Database Setup

Since the automatic database creation in `render.yaml` might not work, follow these steps:

### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `illara-db`
   - **Plan**: Free
   - **Region**: Frankfurt (or closest to you)
4. Click "Create Database"

### 2. Update API Service

1. Go to your `illara-api` service
2. Click "Environment"
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy from your PostgreSQL database (Internal Database URL)

### 3. Update Schema for PostgreSQL

Update `apps/api/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Deploy

1. Commit and push changes
2. Render will automatically redeploy
3. Check logs for migration success

## Alternative: Use SQLite for Development

For local development, keep SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") || "file:./dev.db"
}
```

## Troubleshooting

- **DATABASE_URL not found**: Make sure the environment variable is set in Render
- **Migration failed**: Check if PostgreSQL is accessible from your service
- **Connection timeout**: Verify the database URL is correct
