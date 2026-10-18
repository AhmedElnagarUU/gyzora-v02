'use client';

import Link from 'next/link';
import {useTranslations} from 'next-intl';

import {getDisplayValue} from '@/features/sites/site-data';
import type {SiteLocale} from '@/features/sites/types/site';
import {TEMPLATES} from '../catalog';
import type {TemplateId} from '../types';

export function TemplateSwitcher({
  currentTemplateId,
  slug,
  locale,
}: {
  currentTemplateId: TemplateId;
  slug: string;
  locale: SiteLocale;
}) {
  const t = useTranslations('templatePreview');

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="template-switcher" className="sr-only">
        {t('template')}
      </label>
      <select
        id="template-switcher"
        value={currentTemplateId}
        onChange={(event) => {
          const nextTemplate = event.target.value;
          window.location.href = slug
            ? `/${locale}/templates/${nextTemplate}/${slug}`
            : `/${locale}/templates/${nextTemplate}`;
        }}
        className="appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 pe-8 text-xs font-semibold text-slate-100 shadow-sm transition hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {TEMPLATES.map((template) => (
          <option key={template.id} value={template.id}>
            {getDisplayValue(template.name, locale)}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute end-2.5 text-xs text-slate-400" aria-hidden="true">
        ▼
      </span>
    </div>
  );
}

export function UseTemplateAction({href}: {href: string}) {
  const t = useTranslations('templatePreview');

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
    >
      <span>{t('useTemplate')}</span>
      <span aria-hidden="true" className="rtl:rotate-180">→</span>
    </Link>
  );
}
