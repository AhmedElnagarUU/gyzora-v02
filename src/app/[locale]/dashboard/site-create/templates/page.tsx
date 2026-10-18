import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {TemplateGallery} from '@/features/sites/components/template-gallery';
import {getSiteForOwner} from '@/features/sites/service';
import {isTemplateId} from '@/features/templates/catalog';

export const dynamic = 'force-dynamic';

export default async function SiteTemplateGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{highlight?: string | string[]}>;
}) {
  const {locale} = await params;
  const {highlight} = await searchParams;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  if (await getSiteForOwner(session.user.id)) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({locale, namespace: 'siteSetup'});
  const highlightId = typeof highlight === 'string' && isTemplateId(highlight) ? highlight : undefined;

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {t('eyebrow')}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('gallery.heading')}</h1>
        <p className="mt-3 text-slate-600">{t('gallery.description')}</p>
      </div>
      <TemplateGallery highlightId={highlightId} />
    </div>
  );
}
