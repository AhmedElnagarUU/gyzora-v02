import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

import type {ProjectView} from '@/features/projects/types';
import {getDisplayValue} from '@/features/sites/site-data';
import type {SiteLocale} from '@/features/sites/types/site';
import {Link} from '@/i18n/navigation';

import {DeleteProjectDialog} from './delete-project-dialog';

export async function ProjectCard({
  project,
  coverUrl,
  siteLocale,
}: {
  project: ProjectView;
  coverUrl?: string;
  siteLocale: SiteLocale;
}) {
  const t = await getTranslations('projects');
  const title = getDisplayValue(project.title, siteLocale);
  const category = getDisplayValue(project.category, siteLocale);
  const location = getDisplayValue(project.location, siteLocale);

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-slate-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={getDisplayValue(project.coverImage?.alt ?? project.title, siteLocale)}
            fill
            sizes="(max-width: 720px) 100vw, 33vw"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-slate-400">
            {t('card.noCover')}
          </div>
        )}
        {project.featured ? (
          <span className="absolute start-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
            {t('card.featured')}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {category || location ? (
            <p className="mt-1 text-sm text-slate-500">
              {[category, location].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <Link
            href={`/dashboard/site/projects/${project.id}/edit`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {t('card.edit')}
          </Link>
          <DeleteProjectDialog projectId={project.id} projectTitle={title} />
        </div>
      </div>
    </article>
  );
}
