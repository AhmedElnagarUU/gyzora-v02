'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

import {Link, usePathname} from '@/i18n/navigation';

export function Sidebar({hasSite}: {hasSite: boolean}) {
  const t = useTranslations('dashboard.nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isOverview = pathname === '/dashboard';
  const isPreview =
    pathname === '/dashboard/site/preview' || pathname.startsWith('/dashboard/site/preview/');

  return (
    <div className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e lg:border-e-slate-200">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="dashboard-navigation"
        className="m-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 lg:hidden"
      >
        {t('menu')}
      </button>
      <nav
        id="dashboard-navigation"
        aria-label={t('label')}
        className={`${isOpen ? 'block' : 'hidden'} px-4 pb-4 lg:block lg:px-6 lg:py-8`}
      >
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/dashboard"
              aria-current={isOverview ? 'page' : undefined}
              className={`flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                isOverview
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t('overview')}
            </Link>
          </li>
          {hasSite ? (
            <li>
              <Link
                href="/dashboard/site/preview"
                aria-current={isPreview ? 'page' : undefined}
                className={`flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                  isPreview
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('preview')}
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
