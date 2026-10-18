import {getTranslations} from 'next-intl/server';

import {getDisplayValue} from '@/features/sites/site-data';
import {getTemplate} from '@/features/templates/catalog';

import type {SiteDocument, SiteLocale} from '../types/site';

export async function SiteOverviewCard({
  site,
  siteLocale,
}: {
  site: SiteDocument;
  siteLocale: SiteLocale;
}) {
  const t = await getTranslations('dashboard.overview');
  const tStatus = await getTranslations('dashboard.status');
  const template = getTemplate(site.templateId);
  const createdAt = new Intl.DateTimeFormat(siteLocale, {dateStyle: 'long'}).format(
    site.createdAt
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        {getDisplayValue(site.data.profile.companyName, siteLocale)}
      </h2>
      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('template')}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-slate-900">
            {template ? getDisplayValue(template.name, siteLocale) : site.templateId}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('status')}
          </dt>
          <dd className="mt-2">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
              {tStatus(site.status)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('created')}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-slate-900">{createdAt}</dd>
        </div>
      </dl>
    </article>
  );
}
