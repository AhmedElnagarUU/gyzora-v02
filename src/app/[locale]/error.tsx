'use client';

import {useTranslations} from 'next-intl';

export default function ErrorPage({retry}: {error: Error & {digest?: string}; retry: () => void}) {
  const t = useTranslations('common.error');

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
      <p className="max-w-md text-slate-600">{t('description')}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        {t('retry')}
      </button>
    </main>
  );
}
