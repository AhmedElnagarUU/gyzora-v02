import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {ProjectForm} from '@/features/projects/components/project-form';
import {getSiteForOwner} from '@/features/sites/service';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  const site = await getSiteForOwner(session.user.id);

  if (!site) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({locale, namespace: 'projects'});

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/site/projects"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        {t('form.back')}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-slate-900">{t('form.createTitle')}</h1>
      <p className="mt-2 text-slate-600">{t('form.createDescription')}</p>

      <div className="mt-6">
        <ProjectForm mode="create" imageUrls={{}} />
      </div>
    </div>
  );
}
