import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Home() {
  const t = await getTranslations('home');
  const tLessons = await getTranslations('lessons');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 font-sans">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-12 py-16 px-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {t('title')}
          </h1>
          <p className="max-w-xl text-xl leading-8 text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Available Lessons Section */}
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {tLessons('title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Noun Lesson Card */}
            <Link
              href="/lessons/noun"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-blue-100 hover:border-blue-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  📦
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Noun Master Challenge
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {tLessons('nounMaster.subtitle')}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Types
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Functions
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </Link>

            {/* More lessons can be added here */}
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="text-4xl">🔜</div>
              <p className="text-gray-500 font-medium">More lessons coming soon!</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col gap-4">
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 shadow-lg hover:shadow-xl"
            href="/lessons/noun"
          >
            {t('startLearning')}
          </Link>
        </div>
      </main>
    </div>
  );
}
