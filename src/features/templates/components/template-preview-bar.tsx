'use client';

import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {getDisplayValue} from '@/features/sites/site-data';
import type {SiteLocale} from '@/features/sites/types/site';
import {TEMPLATES} from '../catalog';
import type {TemplateId, TemplatePageId} from '../types';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const NAVIGATION_PAGES: readonly {id: TemplatePageId; labelKey: string; slug: string}[] = [
  {id: 'home', labelKey: 'home', slug: ''},
  {id: 'about', labelKey: 'about', slug: 'about'},
  {id: 'services', labelKey: 'services', slug: 'services'},
  {id: 'projects', labelKey: 'projects', slug: 'projects'},
  {id: 'contact', labelKey: 'contact', slug: 'contact'},
];

export function TemplatePreviewBar({
  currentTemplateId,
  currentPageId,
  locale,
  useTemplateHref,
  viewport,
  onViewportChange,
}: {
  currentTemplateId: TemplateId;
  currentPageId: TemplatePageId;
  locale: SiteLocale;
  useTemplateHref: string;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
}) {
  const t = useTranslations('templatePreview');
  const brandT = useTranslations('common.brand');
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const targetLocaleLabel = t(`language.${targetLocale}`);

  // Compute page path for switching
  const getPageHref = (templateId: TemplateId, pageSlug: string) => {
    return pageSlug
      ? `/${locale}/templates/${templateId}/${pageSlug}`
      : `/${locale}/templates/${templateId}`;
  };

  const currentSlug = currentPageId === 'home'
    ? ''
    : currentPageId === 'project-details'
      ? 'projects'
      : currentPageId;

  const currentActivePage = currentPageId === 'project-details' ? 'projects' : currentPageId;

  // Language switch preserves template and page
  const langSwitchHref = currentSlug
    ? `/${targetLocale}/templates/${currentTemplateId}/${currentSlug}`
    : `/${targetLocale}/templates/${currentTemplateId}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md text-slate-100 shadow-lg">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
        {/* Brand & Sample Badge & Template Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href={`/${locale}/dashboard/site-create/templates`}
            className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            title={t('backToTemplates')}
          >
            <span className="font-bold uppercase tracking-wider text-emerald-400">{brandT('name')}</span>
            <span className="text-slate-500">/</span>
            <span className="hidden sm:inline">{t('backToTemplates')}</span>
          </Link>

          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            {t('badge')}
          </span>

          {/* Template Switcher Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="template-switcher" className="sr-only">
              {t('template')}
            </label>
            <select
              id="template-switcher"
              value={currentTemplateId}
              onChange={(e) => {
                const nextTemplate = e.target.value as TemplateId;
                window.location.href = getPageHref(nextTemplate, currentSlug);
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
        </div>

        {/* Page Navigator */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1" aria-label={t('navLabel')}>
          {NAVIGATION_PAGES.map((navPage) => {
            const isActive = currentActivePage === navPage.id;
            const href = getPageHref(currentTemplateId, navPage.slug);
            return (
              <Link
                key={navPage.id}
                href={href}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {t(`pages.${navPage.labelKey}`)}
              </Link>
            );
          })}
        </nav>

        {/* Viewports & Language & Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Viewport Toggles */}
          <div
            className="hidden items-center rounded-lg border border-slate-700/80 bg-slate-800/80 p-0.5 sm:inline-flex"
            role="group"
            aria-label={t('viewportLabel')}
          >
            <button
              type="button"
              onClick={() => onViewportChange('desktop')}
              className={`rounded px-2 py-1 text-xs font-medium transition ${
                viewport === 'desktop'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t('viewports.desktop')}
              aria-pressed={viewport === 'desktop'}
            >
              <span className="me-1" aria-hidden="true">🖥️</span>
              {t('viewports.desktop')}
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('tablet')}
              className={`rounded px-2 py-1 text-xs font-medium transition ${
                viewport === 'tablet'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t('viewports.tablet')}
              aria-pressed={viewport === 'tablet'}
            >
              <span className="me-1" aria-hidden="true">📱</span>
              {t('viewports.tablet')}
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('mobile')}
              className={`rounded px-2 py-1 text-xs font-medium transition ${
                viewport === 'mobile'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t('viewports.mobile')}
              aria-pressed={viewport === 'mobile'}
            >
              <span className="me-1" aria-hidden="true">📲</span>
              {t('viewports.mobile')}
            </button>
          </div>

          {/* Language Switcher */}
          <Link
            href={langSwitchHref}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            {targetLocaleLabel}
          </Link>

          {/* Use This Template Button */}
          <Link
            href={useTemplateHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <span>{t('useTemplate')}</span>
            <span aria-hidden="true" className="rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
