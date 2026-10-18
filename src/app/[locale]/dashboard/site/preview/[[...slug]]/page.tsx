import type {Metadata} from 'next';
import {notFound, redirect} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {getSession} from '@/features/auth/lib/session';
import {getSiteForOwner} from '@/features/sites/service';
import {toRenderData} from '@/features/sites/to-render-data';
import type {SiteLocale} from '@/features/sites/types/site';
import {getTemplate} from '@/features/templates/catalog';
import {PreviewChrome} from '@/features/templates/components/preview-chrome';
import {TemplateRenderer} from '@/features/templates/render/TemplateRenderer';
import type {TemplatePageId, TemplateProject} from '@/features/templates/types';
import {routing} from '@/i18n/routing';

const BASE_PATH = '/dashboard/site/preview';

interface PageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'templatePreview'});

  return {
    title: t('metadata.draftTitle'),
    robots: {index: false, follow: false},
  };
}

export default async function SitePreviewPage({params}: PageProps) {
  const {locale, slug} = await params;

  if (!routing.locales.includes(locale as SiteLocale)) {
    notFound();
  }

  const siteLocale = locale as SiteLocale;
  setRequestLocale(siteLocale);

  const session = await getSession();
  if (!session) {
    redirect(`/${siteLocale}/auth/sign-in`);
  }

  const site = await getSiteForOwner(session.user.id);
  if (!site) {
    redirect(`/${siteLocale}/dashboard`);
  }

  const template = getTemplate(site.templateId);
  if (!template) {
    notFound();
  }

  const siteData = toRenderData(site.data);

  let pageId: TemplatePageId = 'home';
  let project: TemplateProject | undefined;

  if (!slug || slug.length === 0) {
    pageId = 'home';
  } else if (slug.length === 1) {
    const single = slug[0];
    if (single === 'about' || single === 'services' || single === 'projects' || single === 'contact') {
      pageId = single;
    } else {
      notFound();
    }
  } else if (slug.length === 2 && slug[0] === 'projects') {
    pageId = 'project-details';
    project = siteData.projects?.find((item) => item.id === slug[1]);
    if (!project) {
      notFound();
    }
  } else {
    notFound();
  }

  const hrefForPage = (targetPageId: TemplatePageId, targetProjectId?: string) => {
    if (targetPageId === 'home') {
      return `/${siteLocale}${BASE_PATH}`;
    }
    if (targetPageId === 'project-details') {
      const projectId = targetProjectId || siteData.projects?.[0]?.id || 'project';
      return `/${siteLocale}${BASE_PATH}/projects/${projectId}`;
    }

    return `/${siteLocale}${BASE_PATH}/${targetPageId}`;
  };

  return (
    <PreviewChrome
      backHref={`/${siteLocale}/dashboard`}
      backLabelKey="backToDashboard"
      badgeKey="badgeDraft"
      basePath={BASE_PATH}
      pageId={pageId}
      slug={slug ? slug.join('/') : ''}
      locale={siteLocale}
    >
      {pageId === 'project-details' && project ? (
        <TemplateRenderer
          template={template}
          site={siteData}
          locale={siteLocale}
          mode="draft"
          pageId="project-details"
          project={project}
          hrefForPage={hrefForPage}
        />
      ) : (
        <TemplateRenderer
          template={template}
          site={siteData}
          locale={siteLocale}
          mode="draft"
          pageId={pageId as Exclude<TemplatePageId, 'project-details'>}
          hrefForPage={hrefForPage}
        />
      )}
    </PreviewChrome>
  );
}
