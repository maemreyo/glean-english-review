# Deployment Guide for Vercel

This guide covers deploying the Glean English Review application to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Supabase Project Setup](#supabase-project-setup)
- [Database Migration](#database-migration)
- [Vercel Environment Variables](#vercel-environment-variables)
- [Connecting GitHub to Vercel](#connecting-github-to-vercel)
- [Deploying](#deploying)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

Before deploying, ensure you have:

- A GitHub repository with your code
- A Supabase account ([sign up free](https://supabase.com/signup))
- A Vercel account ([sign up free](https://vercel.com/signup))
- Git installed on your local machine

## Supabase Project Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: e.g., `glean-english-review`
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose a region close to your users (e.g., Singapore for Asia)
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: Found under "Project API keys"
   - **anon/public key**: Found under "Project API keys"

You'll need these for Vercel environment variables.

## Database Migration

### Run the Migration in Supabase SQL Editor

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the contents of [`supabase/migrations/001_create_lesson_history.sql`](supabase/migrations/001_create_lesson_history.sql):

```sql
-- Create lesson_history table
CREATE TABLE IF NOT EXISTS public.lesson_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own lesson history
CREATE POLICY "Users can view own lesson history"
ON public.lesson_history
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy: Users can insert their own lesson history
CREATE POLICY "Users can insert own lesson history"
ON public.lesson_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_lesson_history_user_id ON public.lesson_history(user_id);
```

4. Click **"Run"** to execute the migration
5. Verify the table was created by checking under **Database** → **Tables**

## Vercel Environment Variables

### Option 1: Add via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

5. Click **"Save"**

### Option 2: Add via Vercel CLI

If you prefer using the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Connecting GitHub to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel will detect it's a Next.js project automatically
5. Configure the project:
   - **Project Name**: e.g., `glean-english-review`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click **"Deploy"**

## Deploying

### Automatic Deployment

Once connected, Vercel will automatically deploy:
- **On every push** to the main branch → Production
- **On every push** to other branches → Preview deployments

### Manual Deployment

To deploy manually:

```bash
# Using Vercel CLI
vercel --prod
```

Or from the Vercel dashboard:
1. Go to your project
2. Click **"Deployments"**
3. Click **"Redeploy"** next to any previous deployment

## Post-Deployment Configuration

### Configure Redirect URLs in Supabase

For authentication to work properly, you need to add your Vercel deployment URL to Supabase's allowed redirect URLs:

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your deployment URL to **Redirect URLs**:
   - Production: `https://your-app.vercel.app/**`
   - Preview URLs: `https://*.vercel.app/**`
   - Local development: `http://localhost:3000/**`
3. Click **"Save"**

### Enable Email Confirmation (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Email**
3. Enable **"Confirm email"**
4. Configure email templates if needed

## Post-Deployment Checklist

After deployment, verify the following:

- [ ] **Database Migration**: The `lesson_history` table exists in Supabase
- [ ] **Redirect URLs**: Your Vercel URL is added to Supabase Auth redirect URLs
- [ ] **Email Confirmation**: Email confirmation is enabled in Supabase
- [ ] **Test Sign Up**: Create a new account on the deployed site
- [ ] **Test Login**: Log in with the created account
- [ ] **Test Lesson Completion**: Complete a lesson and verify it saves to history
- [ ] **Test Lesson History**: Check that completed lessons appear in history
- [ ] **Test Language Switching**: Verify English/Vietnamese switching works
- [ ] **Test Responsive Design**: Check mobile and desktop layouts

## Troubleshooting

### "Invalid URL" Error

- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly in Vercel environment variables
- Ensure the URL includes `https://` and does not have a trailing slash

### Authentication Not Working

- Check that redirect URLs are configured correctly in Supabase
- Verify the `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check browser console for error messages

### Database Errors

- Ensure the migration was run successfully in Supabase SQL Editor
- Verify RLS policies are created correctly
- Check Supabase logs: **Database** → **Logs**

### Build Failures

- Check Vercel deployment logs for specific error messages
- Ensure all dependencies are installed: `npm install`
- Verify TypeScript compilation: `npm run build`

## Continuous Deployment

With GitHub connected, Vercel automatically:
- Deploys to **Production** when you push to `main` branch
- Creates **Preview** deployments for pull requests
- Shows deployment status in GitHub

## Environment-Specific Deployments

### Preview Deployments

Every branch gets its own preview URL:
```
https://your-branch-name.your-app.vercel.app
```

### Production Deployment

The main branch deploys to:
```
https://your-app.vercel.app
```

## Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update Supabase redirect URLs to include your custom domain

## Support

If you encounter issues:

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Deployment Guide**: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
