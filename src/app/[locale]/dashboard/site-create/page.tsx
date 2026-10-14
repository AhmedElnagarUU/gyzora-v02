import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {CreateSiteForm} from '@/features/sites/components/create-site-form';

export const dynamic = 'force-dynamic';

export default async function SiteCreatePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  const t = await getTranslations({locale, namespace: 'siteSetup'});

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('eyebrow')}</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('title')}</h1>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </div>
        <CreateSiteForm />
      </div>
    </main>
  );
}
