import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Clear any corrupted cookies before creating the client
  clearCorruptedCookies()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
          
          // If cookie value is '[object Object]', clear it and return undefined
          if (value === '[object Object]') {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            return undefined
          }
          
          return value
        },
        set(name: string, value: string, options?: any) {
          // Ensure cookie value is always a string
          const cookieValue = typeof value === 'string' ? value : JSON.stringify(value)
          let cookieString = `${name}=${cookieValue}`
          
          if (options) {
            if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
            if (options.secure) cookieString += `; Secure`
            if (options.httpOnly) cookieString += `; HttpOnly`
          }
          
          document.cookie = cookieString
        },
        remove(name: string, options?: any) {
          let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
          if (options?.path) cookieString += `; Path=${options.path}`
          if (options?.domain) cookieString += `; Domain=${options.domain}`
          document.cookie = cookieString
        }
      }
    }
  )
}

/**
 * Clear any corrupted cookies from the browser
 * This fixes the '[object Object]' cookie issue
 */
function clearCorruptedCookies() {
  if (typeof document === 'undefined') return
  
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=')
    if (value === '[object Object]' || value === undefined) {
      // Clear the corrupted cookie
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }
}
