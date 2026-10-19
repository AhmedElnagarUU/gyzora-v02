import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {getPublicImageUrl} from '@/features/images/public-url';
import {ProjectList} from '@/features/projects/components/project-list';
import {listProjectsForOwner} from '@/features/projects/service';
import {getSiteForOwner} from '@/features/sites/service';
import type {SiteLocale} from '@/features/sites/types/site';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({params}: {params: Promise<{locale: string}>}) {
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
  const projects = await listProjectsForOwner(session.user.id);
  const siteLocale: SiteLocale = locale === 'ar' ? 'ar' : 'en';
  const imageUrls: Record<string, string> = {};

  for (const project of projects) {
    for (const image of [...(project.coverImage ? [project.coverImage] : []), ...project.gallery]) {
      imageUrls[image.key] = getPublicImageUrl(image.key);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t('eyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('title')}</h1>
          <p className="mt-3 text-slate-600">{t('description')}</p>
        </div>
        <Link
          href="/dashboard/site/projects/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('add')}
        </Link>
      </div>

      <div className="mt-8">
        <ProjectList projects={projects} imageUrls={imageUrls} siteLocale={siteLocale} />
      </div>
    </div>
  );
}
