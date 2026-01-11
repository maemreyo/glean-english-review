import Link from 'next/link'
import { signUpAction } from '../../auth/actions'
import { getTranslations } from 'next-intl/server'

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
            <i className="fas fa-user-plus mr-2"></i> {t('signup')}
          </h1>
          <p className="text-indigo-200 mt-1 text-sm">{t('signupTitle')}</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form action={signUpAction} className="space-y-6">
            {/* Error Message Display */}
            <div id="error-message" className="hidden rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {/* Error messages will be displayed here via client-side script */}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder={t('passwordPlaceholder')}
              />
              <p className="mt-1 text-xs text-gray-500">{t('weakPassword')}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <i className="fas fa-user-plus mr-2"></i> {t('signupButton')}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('hasAccount')}{' '}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {t('login')}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-2 text-center text-[10px] text-gray-400 border-t">
          Teacher Tools for Classroom Interaction
        </div>
      </div>

      {/* Client-side script for error handling */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Check for error in URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const error = urlParams.get('error');
          if (error) {
            const errorEl = document.getElementById('error-message');
            errorEl.textContent = error;
            errorEl.classList.remove('hidden');
          }
        `
      }} />
    </div>
  )
}
