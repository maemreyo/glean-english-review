import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            {t('title')}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 md:w-[200px]"
            href="/login"
          >
            {t('startLearning')}
          </Link>
        </div>
      </main>
    </div>
  );
}
