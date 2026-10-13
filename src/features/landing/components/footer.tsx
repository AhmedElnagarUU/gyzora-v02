import {useTranslations} from 'next-intl';

export function Footer() {
  const t = useTranslations('landing.footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <a href="#home" className="font-bold text-slate-800 transition hover:text-emerald-800">
          Gyzora
        </a>
        <p>{t('copyright', {year})}</p>
        <a href="#home" className="font-medium text-emerald-800 transition hover:text-emerald-950">
          {t('backToTop')}
        </a>
      </div>
    </footer>
  );
}