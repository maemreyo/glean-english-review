import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale } from '@/i18n/config'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Filter out corrupted cookies that have '[object Object]' as value
          return request.cookies.getAll().filter(cookie => {
            const isCorrupted = cookie.value === '[object Object]' ||
                               typeof cookie.value !== 'string' ||
                               cookie.value === undefined
            if (isCorrupted) {
              console.log(`[DEBUG] Filtered corrupted cookie: ${cookie.name} = ${cookie.value}`)
            }
            return !isCorrupted
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((cookie) => {
            // Ensure cookie value is always a string - objects will cause '[object Object]'
            const value = typeof cookie.value === 'string' ? cookie.value : JSON.stringify(cookie.value)
            supabaseResponse.cookies.set(cookie.name, value, cookie.options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    // Redirect to locale-prefixed login path (e.g., /vi/login for default locale)
    url.pathname = `/${defaultLocale}/login`
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}
