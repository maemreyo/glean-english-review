# Issue: 431 Request Header Fields Too Large

## Problem Description
When completing the noun lesson quiz, the POST request to `/lessons/noun` returns a **431 Request Header Fields Too Large** error. The issue was caused by a corrupted cookie with value `[object Object]` being sent in the Cookie header.

## Root Cause
A cookie value was being set as an object instead of a string. When JavaScript converts an object to a string (e.g., in headers), it becomes `[object Object]`, which caused the malformed and oversized cookie header.

## Files Modified

### 1. [`lib/supabase/middleware.ts`](../lib/supabase/middleware.ts) - Filter corrupted cookies when reading
- Added filtering to remove cookies with `[object Object]` value
- Added validation to ensure cookie values are strings when setting

### 2. [`lib/supabase/server.ts`](../lib/supabase/server.ts) - Ensure cookie values are strings
- Added type checking and JSON.stringify for non-string cookie values

### 3. [`lib/supabase/client.ts`](../lib/supabase/client.ts) - Client-side cookie handling
- Added custom cookie get/set methods
- Added corrupted cookie clearing on client initialization

### 4. [`app/[locale]/layout.tsx`](../app/[locale]/layout.tsx) - Automatic cookie clearing
- Added inline script to clear corrupted cookies immediately on page load
- Added ClearCorruptedCookies component

### 5. [`components/ClearCorruptedCookies.tsx`](../components/ClearCorruptedCookies.tsx) - React component
- Created component to clear corrupted cookies

### 6. [`public/clear-cookies.html`](../public/clear-cookies.html) - Standalone fix page
- Created standalone HTML page to manually clear all corrupted cookies

## How to Fix Existing Corrupted Cookies

### Option 1: Use the Standalone Page (Recommended)
1. Open `http://localhost:3003/clear-cookies.html` in your browser
2. Click the "Clear All Cookies" button
3. Refresh your application page

### Option 2: Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Application/Storage > Cookies
3. Find any cookie with value `[object Object]`
4. Delete those cookies
5. Refresh the page

### Option 3: Clear All Site Data
1. Open browser settings
2. Clear all cookies and site data for localhost:3003
3. Refresh the page

## Prevention
The code changes ensure that:
- All cookie values are validated to be strings before being set
- Corrupted cookies are automatically filtered out when reading
- An inline script runs immediately to clear any remaining corrupted cookies

## Original Error
```
HTTP/1.1 431 Request Header Fields Too Large
Connection: close
```

With the corrupted cookie header:
```
-H 'Cookie: [object Object]'
```