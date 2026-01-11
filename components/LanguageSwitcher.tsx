'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale() as Locale;

  const switchLocale = (newLocale: Locale) => {
    // Remove the current locale from pathname if it exists
    const segments = pathname.split('/');
    const hasLocale = segments[1] && locales.includes(segments[1] as Locale);
    
    let newPathname: string;
    if (hasLocale) {
      // Replace current locale with new locale
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add new locale to the beginning
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            currentLocale === locale
              ? 'bg-indigo-600 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          {locale === 'vi' ? 'Tiếng Việt' : 'English'}
        </button>
      ))}
    </div>
  );
}
