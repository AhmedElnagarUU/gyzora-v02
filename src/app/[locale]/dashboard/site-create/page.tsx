import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {CreateSiteForm} from '@/features/sites/components/create-site-form';
import {parseFieldErrors} from '@/features/sites/field-errors';
import {getSiteForOwner} from '@/features/sites/service';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function SiteCreatePage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{fields?: string | string[]}>;
}) {
  const {locale} = await params;
  const {fields} = await searchParams;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  if (await getSiteForOwner(session.user.id)) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({locale, namespace: 'siteSetup'});

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        {t('actions.backToDashboard')}
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('eyebrow')}</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('firstStep.title')}</h1>
          <p className="mt-3 text-slate-600">{t('firstStep.description')}</p>
        </div>
        <CreateSiteForm fieldErrors={parseFieldErrors(fields)} />
      </div>
    </div>
  );
}
