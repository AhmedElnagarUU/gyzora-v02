import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {getPublicImageUrl} from '@/features/images/public-url';
import {toEditorDraft} from '@/features/sites/apply-edit';
import {EditorForm} from '@/features/sites/components/editor/editor-form';
import {getSiteForOwner} from '@/features/sites/service';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function SiteContentPage({params}: {params: Promise<{locale: string}>}) {
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

  const t = await getTranslations({locale, namespace: 'siteSetup'});

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        {t('actions.backToDashboard')}
      </Link>

      <div className="mt-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t('edit.eyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('edit.title')}</h1>
          <p className="mt-3 text-slate-600">{t('edit.description')}</p>
        </div>

        <EditorForm
          draft={toEditorDraft(site.data)}
          revision={site.revision}
          logoPreviewUrl={
            site.data.profile.logoKey
              ? getPublicImageUrl(site.data.profile.logoKey)
              : site.data.profile.logoUrl
          }
        />
      </div>
    </div>
  );
}
