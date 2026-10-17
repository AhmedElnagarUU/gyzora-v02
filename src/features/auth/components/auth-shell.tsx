import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/shared/ui/language-switcher';

export async function AuthShell({children}: {children: React.ReactNode}) {
  const t = await getTranslations('common.brand');

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between gap-4 px-4 py-6 sm:px-8">
        <Link
          href="/"
          aria-label={t('homeLabel')}
          className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm"
          >
            G
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">{t('name')}</span>
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
