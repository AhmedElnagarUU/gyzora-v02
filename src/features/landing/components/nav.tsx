import {useTranslations} from 'next-intl';

export function Nav() {
  const t = useTranslations('landing.nav');

  return (
    <nav aria-label={t('label')} className="-mx-1 overflow-x-auto">
      <ul className="flex w-max min-w-full gap-6 px-1 text-sm font-medium sm:gap-8">
        <li>
          <a href="#features" className="inline-flex py-1 text-slate-600 transition-colors hover:text-emerald-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {t('features')}
          </a>
        </li>
        <li>
          <a href="#how-it-works" className="inline-flex py-1 text-slate-600 transition-colors hover:text-emerald-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {t('howItWorks')}
          </a>
        </li>
        <li>
          <a href="#industries" className="inline-flex py-1 text-slate-600 transition-colors hover:text-emerald-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {t('industries')}
          </a>
        </li>
        <li>
          <a href="#faq" className="inline-flex py-1 text-slate-600 transition-colors hover:text-emerald-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            {t('faq')}
          </a>
        </li>
      </ul>
    </nav>
  );
}