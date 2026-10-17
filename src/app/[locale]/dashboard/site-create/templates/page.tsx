import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {TemplateGallery} from '@/features/sites/components/template-gallery';
import {getTemplate} from '@/features/templates/catalog';

export const dynamic = 'force-dynamic';

export default async function SiteTemplateGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{preview?: string | string[]}>;
}) {
  const {locale} = await params;
  const {preview} = await searchParams;
  const previewTemplate =
    typeof preview === 'string' ? getTemplate(preview) : null;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/sign-in`);

  const t = await getTranslations({locale, namespace: 'siteSetup'});

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t('eyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            {previewTemplate
              ? t('preview.title', {name: previewTemplate.name[locale === 'ar' ? 'ar' : 'en']})
              : t('gallery.heading')}
          </h1>
          {!previewTemplate ? <p className="mt-3 text-slate-600">{t('gallery.description')}</p> : null}
        </div>
        <TemplateGallery previewTemplateId={previewTemplate?.id} />
      </div>
    </main>
  );
}
