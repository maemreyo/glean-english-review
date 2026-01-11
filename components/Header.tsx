import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './LogoutButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
}

export async function Header({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { locale } = await params
  const t = await getTranslations('common')

  return (
    <header className="bg-indigo-600 p-4 md:p-6 text-center relative">
      <div className="flex items-center justify-between gap-4">
        {/* Logo/Title */}
        <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
            <i className="fas fa-graduation-cap mr-2"></i> Glean English
          </h1>
        </Link>

        {/* Language Switcher */}
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        )}

        {/* Login link when not authenticated */}
        {!user && (
          <Link
            href={`/${locale}/login`}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/30 backdrop-blur-sm whitespace-nowrap"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> {t('login')}
          </Link>
        )}
      </div>
    </header>
  )
}
