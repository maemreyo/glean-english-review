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
  // First handle locale routing - this may redirect to add locale prefix
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware returns a redirect, honor it first
  // This ensures URLs get their locale prefix before auth checks
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }
  
  // Then handle auth session (only if no redirect from intl)
  const authResponse = await updateSession(request);
  
  // Return auth response if it's a redirect, otherwise return intl response
  return authResponse.status >= 300 && authResponse.status < 400 ? authResponse : intlResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
