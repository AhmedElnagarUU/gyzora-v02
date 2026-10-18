import {getTranslations, setRequestLocale} from 'next-intl/server';

import {getSession} from '@/features/auth/lib/session';
import {SiteOverviewCard} from '@/features/sites/components/site-overview-card';
import {getSiteForOwner} from '@/features/sites/service';
import type {SiteLocale} from '@/features/sites/types/site';
import {Link} from '@/i18n/navigation';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{created?: string}>;
}) {
  const {locale} = await params;
  const {created} = await searchParams;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    return null;
  }

  const site = await getSiteForOwner(session.user.id);
  const t = await getTranslations({locale, namespace: 'dashboard.overview'});
  const tSetup = await getTranslations({locale, namespace: 'siteSetup'});
  const siteLocale: SiteLocale = locale === 'ar' ? 'ar' : 'en';

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('title')}</h1>

      {created === '1' ? (
        <p
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {tSetup('success')}
        </p>
      ) : null}

      {site ? (
        <div className="mt-8">
          <SiteOverviewCard site={site} siteLocale={siteLocale} />
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{t('emptyTitle')}</h2>
          <p className="mt-3 text-sm text-slate-600">{t('emptyDescription')}</p>
          <Link
            href="/dashboard/site-create"
            className="mt-6 inline-flex items-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            {t('createAction')}
          </Link>
        </div>
      )}
    </div>
  );
}
