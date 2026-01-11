'use client'

import { useEffect } from 'react'

/**
 * Clear any corrupted cookies from the browser.
 * This fixes the '[object Object]' cookie issue that causes 431 errors.
 * Must run early before any Supabase client initialization.
 */
export function clearCorruptedCookies() {
  if (typeof document === 'undefined') return
  
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const eqIndex = cookie.indexOf('=')
    if (eqIndex === -1) continue
    
    const name = cookie.substring(0, eqIndex)
    const value = cookie.substring(eqIndex + 1)
    
    // Check for corrupted cookie values
    if (value === '[object Object]' || value === 'undefined' || value === '') {
      console.log(`[ClearCorruptedCookies] Clearing corrupted cookie: ${name}`)
      
      // Clear the cookie with all possible path/domain combinations
      const paths = ['/', `/${window.location.pathname.split('/')[1]}`]
      const domains = [window.location.hostname, `.${window.location.hostname}`, '']
      
      for (const path of paths) {
        for (const domain of domains) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}`
        }
      }
    }
  }
}

export default function ClearCorruptedCookies() {
  useEffect(() => {
    clearCorruptedCookies()
  }, [])
  
  return null
}
