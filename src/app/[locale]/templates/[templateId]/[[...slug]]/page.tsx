import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import type {SiteLocale} from '@/features/sites/types/site';
import {getTemplate, isTemplateId} from '@/features/templates/catalog';
import {getSampleSiteData} from '@/features/templates/sample-data';
import {TemplateRenderer} from '@/features/templates/render/TemplateRenderer';
import {TemplatePreviewShell} from '@/features/templates/components/template-preview-shell';
import type {TemplatePageId, TemplateProject} from '@/features/templates/types';

interface PageProps {
  params: Promise<{
    locale: string;
    templateId: string;
    slug?: string[];
  }>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, templateId, slug} = await params;
  if (!isTemplateId(templateId)) return {};
  const template = getTemplate(templateId);
  if (!template) return {};

  const siteLocale = (locale === 'ar' ? 'ar' : 'en') as SiteLocale;
  const templateName = template.name[siteLocale];
  const pageKey = slug?.[0] ?? 'home';

  const t = await getTranslations({locale, namespace: 'templatePreview'});

  return {
    title: t('metadata.title', {template: templateName, page: t(`pages.${pageKey}`)}),
    description: t('metadata.description', {template: templateName})
  };
}

export default async function TemplatePreviewPage({params}: PageProps) {
  const {locale, templateId, slug} = await params;

  if (!routing.locales.includes(locale as SiteLocale)) {
    notFound();
  }

  const siteLocale = locale as SiteLocale;
  setRequestLocale(siteLocale);

  if (!isTemplateId(templateId)) {
    notFound();
  }

  const template = getTemplate(templateId);
  if (!template) {
    notFound();
  }

  const siteData = getSampleSiteData(templateId);

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
    const projectId = slug[1];
    project = siteData.projects?.find((p) => p.id === projectId);
    if (!project) {
      notFound();
    }
  } else {
    notFound();
  }

  const hrefForPage = (targetPageId: TemplatePageId, targetProjectId?: string) => {
    if (targetPageId === 'home') {
      return `/${siteLocale}/templates/${templateId}`;
    }
    if (targetPageId === 'project-details') {
      const pId = targetProjectId || siteData.projects?.[0]?.id || 'project';
      return `/${siteLocale}/templates/${templateId}/projects/${pId}`;
    }
    return `/${siteLocale}/templates/${templateId}/${targetPageId}`;
  };

  return (
    <TemplatePreviewShell templateId={template.id} pageId={pageId} locale={siteLocale}>
      {pageId === 'project-details' && project ? (
        <TemplateRenderer
          template={template}
          site={siteData}
          locale={siteLocale}
          mode="sample"
          pageId="project-details"
          project={project}
          hrefForPage={hrefForPage}
        />
      ) : (
        <TemplateRenderer
          template={template}
          site={siteData}
          locale={siteLocale}
          mode="sample"
          pageId={pageId as Exclude<TemplatePageId, 'project-details'>}
          hrefForPage={hrefForPage}
        />
      )}
    </TemplatePreviewShell>
  );
}
