import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound, redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {getPublicImageUrl} from '@/features/images/public-url';
import {ProjectForm} from '@/features/projects/components/project-form';
import {getProjectForOwner} from '@/features/projects/service';
import {getSiteForOwner} from '@/features/sites/service';
import {AppError} from '@/shared/http/app-error';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {locale, id} = await params;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  const site = await getSiteForOwner(session.user.id);

  if (!site) {
    redirect(`/${locale}/dashboard`);
  }

  const project = await getProjectForOwner(session.user.id, id).catch((error: unknown) => {
    if (error instanceof AppError && error.code === 'NOT_FOUND') notFound();

    throw error;
  });

  const t = await getTranslations({locale, namespace: 'projects'});
  const imageUrls: Record<string, string> = {};

  for (const image of [...(project.coverImage ? [project.coverImage] : []), ...project.gallery]) {
    imageUrls[image.key] = getPublicImageUrl(image.key);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/site/projects"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        {t('form.back')}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-slate-900">{t('form.editTitle')}</h1>

      <div className="mt-6">
        <ProjectForm
          mode="edit"
          initial={{
            id: project.id,
            title: project.title,
            description: project.description,
            category: project.category,
            location: project.location,
            coverImage: project.coverImage,
            gallery: project.gallery,
            metadata: project.metadata,
            featured: project.featured,
          }}
          imageUrls={imageUrls}
        />
      </div>
    </div>
  );
}
