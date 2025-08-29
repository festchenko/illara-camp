# 🚀 Quick Setup for Illara Camp

## Problem: Database not configured on Render

The app is failing because PostgreSQL database is not set up on Render.

## Solution: Manual PostgreSQL Setup

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `illara-db`
   - **Plan**: Free
   - **Region**: Frankfurt (or closest)
4. Click **"Create Database"**

### Step 2: Copy Database URL

1. Click on your new `illara-db` database
2. Copy the **"Internal Database URL"** (looks like: `postgresql://user:pass@host:port/db`)

### Step 3: Update API Environment

1. Go to your `illara-api` service
2. Click **"Environment"**
3. Add new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the database URL from Step 2
4. Click **"Save Changes"**

### Step 4: Redeploy

1. Go back to your `illara-api` service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Step 5: Test

Wait 2-3 minutes, then test:
- Frontend: https://illara-camp-webapp.vercel.app
- API: https://illara-api.onrender.com/health

## Expected Result

After setup:
- ✅ API responds with `{"ok":true}`
- ✅ Wallet API works: `GET /wallet`
- ✅ App loads without "Loading..." hang
- ✅ Users can play games and earn ILL tokens

## Troubleshooting

- **Still getting errors**: Check Render logs for migration issues
- **Database connection failed**: Verify the DATABASE_URL is correct
- **App still loading**: Clear browser cache and try again
