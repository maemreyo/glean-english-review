'use client'

import { signOutAction } from '@/app/auth/actions'

export function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await signOutAction()
      }}
      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/30 backdrop-blur-sm"
    >
      <i className="fas fa-sign-out-alt mr-2"></i> Logout
    </button>
  )
}
