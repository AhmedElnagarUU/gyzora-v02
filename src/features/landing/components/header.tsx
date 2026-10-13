import {useTranslations} from 'next-intl';
import {Nav} from './nav';
import {LanguageSwitcher} from './language-switcher';

export function Header() {
  const t = useTranslations('landing.nav');

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
          <LanguageSwitcher />
        </div>
        <Nav />
      </div>
    </header>
  );
}