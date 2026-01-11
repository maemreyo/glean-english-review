# Glean English Review

An interactive English learning application built with Next.js, featuring bilingual support (English/Vietnamese), user authentication, and progress tracking powered by Supabase.

## Features

- **Bilingual Interface**: Full support for English and Vietnamese with easy language switching
- **User Authentication**: Secure signup/login via Supabase Auth
- **Interactive Lessons**: Quiz-based learning with instant feedback
- **Progress Tracking**: Save and view completed lessons
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Next.js App Router

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Database**: [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom React components with confetti celebrations

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher (comes with Node.js)
- **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Then add your Supabase credentials (get these from [Supabase Dashboard](https://supabase.com/dashboard)):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** in your Supabase project
3. Run the migration from [`supabase/migrations/001_create_lesson_history.sql`](supabase/migrations/001_create_lesson_history.sql):

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

### 3. Configure Redirect URLs (for local auth)

In Supabase dashboard, go to **Authentication** → **URL Configuration** and add:

```
http://localhost:3000/**
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   ├── auth/              # Authentication actions
│   └── lessons/           # Lesson server actions
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── db/               # Database functions
│   ├── data/             # Static data (quizzes)
│   ├── supabase/         # Supabase client configurations
│   └── i18n.ts           # i18n configuration
├── messages/             # Translation files (en.json, vi.json)
├── public/               # Static assets
└── supabase/             # Database migrations
    └── migrations/
```

## Deployment to Vercel

For detailed deployment instructions, see [`DEPLOYMENT.md`](DEPLOYMENT.md).

### Quick Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will detect Next.js automatically

3. **Add Environment Variables**
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will deploy automatically on push

5. **Configure Supabase Redirect URLs**
   - Add your Vercel URL to Supabase Auth redirect URLs
   - Format: `https://your-app.vercel.app/**`

### Post-Deployment Checklist

- [ ] Run database migration in Supabase SQL Editor
- [ ] Configure redirect URLs in Supabase Auth settings
- [ ] Enable email confirmation (optional)
- [ ] Test signup/login flow
- [ ] Test lesson completion and history saving

## Key Implementation Details

### Middleware

The application uses [`middleware.ts`](middleware.ts) for both:
1. **Locale detection** - Redirects users to their preferred language
2. **Auth refresh** - Refreshes Supabase session on navigation

### Supabase Integration

- **Client** ([`lib/supabase/client.ts`](lib/supabase/client.ts)) - Browser-side operations
- **Server** ([`lib/supabase/server.ts`](lib/supabase/server.ts)) - Server-side operations
- **Middleware** ([`lib/supabase/middleware.ts`](lib/supabase/middleware.ts)) - Session refresh

### Internationalization

- Language files in [`messages/`](messages/) directory
- Configured via [`i18n/config.ts`](i18n/config.ts)
- Supports English (`en`) and Vietnamese (`vi`)

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is private and proprietary.
