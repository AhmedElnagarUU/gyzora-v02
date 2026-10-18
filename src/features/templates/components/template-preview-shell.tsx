'use client';

import type {ReactNode} from 'react';

import type {SiteLocale} from '@/features/sites/types/site';
import type {TemplateId, TemplatePageId} from '../types';
import {PreviewChrome} from './preview-chrome';
import {TemplateSwitcher, UseTemplateAction} from './template-preview-bar';

function slugForPage(pageId: TemplatePageId): string {
  if (pageId === 'home') return '';
  if (pageId === 'project-details') return 'projects';

  return pageId;
}

export function TemplatePreviewShell({
  templateId,
  pageId,
  locale,
  useTemplateHref,
  children,
}: {
  templateId: TemplateId;
  pageId: TemplatePageId;
  locale: SiteLocale;
  useTemplateHref: string;
  children: ReactNode;
}) {
  const slug = slugForPage(pageId);

  return (
    <PreviewChrome
      backHref={`/${locale}/dashboard/site-create/templates`}
      backLabelKey="backToTemplates"
      badgeKey="badge"
      basePath={`/templates/${templateId}`}
      pageId={pageId}
      slug={slug}
      locale={locale}
      controls={
        <TemplateSwitcher currentTemplateId={templateId} slug={slug} locale={locale} />
      }
      action={<UseTemplateAction href={useTemplateHref} />}
    >
      {children}
    </PreviewChrome>
  );
}
