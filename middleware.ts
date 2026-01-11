import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { locales, defaultLocale } from '@/i18n/config';
import { type NextRequest } from 'next/server';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  // First handle locale routing
  const intlResponse = intlMiddleware(request);
  
  // Then handle auth session
  const authResponse = await updateSession(request);
  
  // Return auth response if it exists, otherwise return intl response
  return authResponse || intlResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
