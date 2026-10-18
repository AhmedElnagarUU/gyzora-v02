'use client';

import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import type {ReactNode} from 'react';

import type {SiteLocale} from '@/features/sites/types/site';
import type {TemplatePageId} from '../types';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const NAVIGATION_PAGES: readonly {id: TemplatePageId; labelKey: string; slug: string}[] = [
  {id: 'home', labelKey: 'home', slug: ''},
  {id: 'about', labelKey: 'about', slug: 'about'},
  {id: 'services', labelKey: 'services', slug: 'services'},
  {id: 'projects', labelKey: 'projects', slug: 'projects'},
  {id: 'contact', labelKey: 'contact', slug: 'contact'},
];

export function PreviewChrome({
  backHref,
  backLabelKey,
  badgeKey,
  basePath,
  pageId,
  slug,
  locale,
  controls,
  action,
  children,
}: {
  backHref: string;
  backLabelKey: string;
  badgeKey: string;
  basePath: string;
  pageId: TemplatePageId;
  slug: string;
  locale: SiteLocale;
  controls?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations('templatePreview');
  const brandT = useTranslations('common.brand');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const activePageId = pageId === 'project-details' ? 'projects' : pageId;

  const hrefForSlug = (target: SiteLocale, targetSlug: string) =>
    targetSlug ? `/${target}${basePath}/${targetSlug}` : `/${target}${basePath}`;

  const viewportButtonClass = (mode: ViewportMode) =>
    `rounded px-2 py-1 text-xs font-medium transition ${
      viewport === mode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
    }`;

  return (
    <div className="template-preview-shell min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md text-slate-100 shadow-lg">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href={backHref}
              className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              title={t(backLabelKey)}
            >
              <span className="font-bold uppercase tracking-wider text-emerald-400">
                {brandT('name')}
              </span>
              <span className="text-slate-500">/</span>
              <span className="hidden sm:inline">{t(backLabelKey)}</span>
            </Link>

            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              {t(badgeKey)}
            </span>

            {controls}
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-1" aria-label={t('navLabel')}>
            {NAVIGATION_PAGES.map((navPage) => {
              const isActive = activePageId === navPage.id;
              const href = hrefForSlug(locale, navPage.slug);

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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className="hidden items-center rounded-lg border border-slate-700/80 bg-slate-800/80 p-0.5 sm:inline-flex"
              role="group"
              aria-label={t('viewportLabel')}
            >
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={viewportButtonClass('desktop')}
                title={t('viewports.desktop')}
                aria-pressed={viewport === 'desktop'}
              >
                <span className="me-1" aria-hidden="true">🖥️</span>
                {t('viewports.desktop')}
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                className={viewportButtonClass('tablet')}
                title={t('viewports.tablet')}
                aria-pressed={viewport === 'tablet'}
              >
                <span className="me-1" aria-hidden="true">📱</span>
                {t('viewports.tablet')}
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={viewportButtonClass('mobile')}
                title={t('viewports.mobile')}
                aria-pressed={viewport === 'mobile'}
              >
                <span className="me-1" aria-hidden="true">📲</span>
                {t('viewports.mobile')}
              </button>
            </div>

            <Link
              href={hrefForSlug(targetLocale, slug)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              {t(`language.${targetLocale}`)}
            </Link>

            {action}
          </div>
        </div>
      </header>
      <div
        className={`template-preview-viewport-wrapper flex-1 w-full flex justify-center transition-colors duration-200 ${
          viewport !== 'desktop' ? 'p-3 sm:p-8 bg-slate-950/95 overflow-x-auto' : ''
        }`}
      >
        <div
          className={`template-preview-frame-container w-full transition-all duration-300 ${
            viewport === 'tablet'
              ? 'max-w-[768px] rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 ring-1 ring-slate-800 my-4'
              : viewport === 'mobile'
                ? 'max-w-[390px] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-slate-800 ring-1 ring-slate-700/50 my-4'
                : 'max-w-full'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
