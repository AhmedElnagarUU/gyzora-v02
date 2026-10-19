'use client';

import {useTranslations} from 'next-intl';

import type {SiteLocale} from '@/features/sites/types/site';

const LOCALES: readonly SiteLocale[] = ['ar', 'en'];

export function LanguageTabs({
  active,
  missing,
  onChange,
}: {
  active: SiteLocale;
  missing: Record<SiteLocale, boolean>;
  onChange: (locale: SiteLocale) => void;
}) {
  const t = useTranslations('siteSetup.editor');

  return (
    <div role="group" aria-label={t('languageLabel')} className="flex flex-wrap items-center gap-2">
      {LOCALES.map((locale) => {
        const isActive = locale === active;

        return (
          <button
            key={locale}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(locale)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
              isActive
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            {t(`languages.${locale}`)}
            {missing[locale] ? (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {t('missing')}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
