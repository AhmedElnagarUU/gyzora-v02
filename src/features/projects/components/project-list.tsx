import {getTranslations} from 'next-intl/server';

import type {ProjectView} from '@/features/projects/types';
import type {SiteLocale} from '@/features/sites/types/site';
import {Link} from '@/i18n/navigation';

import {ProjectCard} from './project-card';

export async function ProjectList({
  projects,
  imageUrls,
  siteLocale,
}: {
  projects: ProjectView[];
  imageUrls: Record<string, string>;
  siteLocale: SiteLocale;
}) {
  const t = await getTranslations('projects');

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{t('empty.title')}</h2>
        <p className="mt-3 text-sm text-slate-600">{t('empty.description')}</p>
        <Link
          href="/dashboard/site/projects/new"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('empty.action')}
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            coverUrl={project.coverImage ? imageUrls[project.coverImage.key] : undefined}
            siteLocale={siteLocale}
          />
        </li>
      ))}
    </ul>
  );
}
