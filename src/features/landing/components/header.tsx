import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import {Nav} from './nav';
import {LanguageSwitcher} from '@/shared/ui/language-switcher';

export function Header() {
  const t = useTranslations('landing.nav');
  const authT = useTranslations('auth.actions');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#home"
            aria-label={t('brandLabel')}
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm">
              G
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">Gyzora</span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${locale}/auth/sign-in`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              {authT('signIn')}
            </Link>
            <Link
              href={`/${locale}/auth/sign-up`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {authT('signUp')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
        <Nav />
      </div>
    </header>
  );
}