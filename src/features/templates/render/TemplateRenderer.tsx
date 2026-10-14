import {useTranslations} from 'next-intl';
import type {CSSProperties} from 'react';
import {getTemplatePage, isTemplateId} from '../catalog';
import {TemplateSection} from './TemplateSections';
import {TemplateImageFrame} from './TemplateImageFrame';
import type {SitePageRendererProps, TemplatePageId} from '../types';
import {getLocalizedText, getTextDirection} from './localized';

const NAVIGATION_PAGE_IDS: readonly TemplatePageId[] = [
  'home',
  'about',
  'services',
  'projects',
  'contact',
];

export function TemplateRenderer(props: SitePageRendererProps) {
  const {template, site, locale, mode, pageId, hrefForPage} = props;
  if (!isTemplateId(template.id)) {
    throw new Error(`Unsupported template ID "${template.id}".`);
  }
  const page = getTemplatePage(template, pageId);

  if (!page) {
    throw new Error(`Page "${pageId}" is not defined by template "${template.id}".`);
  }

  const t = useTranslations('landing.nav');
  const tPreview = useTranslations('landing.page.preview');
  const name = getLocalizedText(site.profile.companyName, locale);
  const project = pageId === 'project-details' ? props.project : undefined;
  const activeNavigationPage = pageId === 'project-details' ? 'projects' : pageId;
  const heroImage = template.images?.['home.hero'];

  return (
    <div
      className="template-site"
      data-template-id={template.id}
      data-font-style={template.style.fontStyle}
      lang={locale}
      dir={getTextDirection(locale)}
      style={
        {
          '--template-accent': template.style.accent,
          '--template-accent-foreground': template.style.accentForeground,
          '--template-background': template.style.background,
          '--template-surface': template.style.surface,
          '--template-foreground': template.style.foreground,
          '--template-muted': template.style.muted,
          '--template-border': template.style.border,
          '--template-radius': template.style.radius,
        } as CSSProperties
      }
    >
      {mode === 'sample' ? (
        <p className="template-sample-label">{tPreview('sample')}</p>
      ) : null}
      <header className="template-header">
        <div className="template-header-inner">
          <a className="template-brand" href={hrefForPage('home')}>
            {site.profile.logoUrl && name ? (
              <TemplateImageFrame
                image={{
                  src: site.profile.logoUrl,
                  alt: site.profile.companyName,
                }}
                locale={locale}
                className="template-logo-image"
              />
            ) : null}
            <span>{name}</span>
          </a>
          <nav className="template-navigation" aria-label={t('label')}>
            {NAVIGATION_PAGE_IDS.map((id) => (
              <a
                aria-current={activeNavigationPage === id ? 'page' : undefined}
                href={hrefForPage(id)}
                key={id}
              >
                {t(id === 'home' ? 'home' : id)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={`template-page template-page-${pageId}`}>
        {page.sections.map((section) => (
          <TemplateSection
            definition={section}
            pageId={pageId}
            site={site}
            locale={locale}
            project={project}
            hrefForProject={(projectId) => hrefForPage('project-details', projectId)}
            hrefForContact={hrefForPage('contact')}
            heroImage={pageId === 'home' ? heroImage : undefined}
            key={section.id}
          />
        ))}
      </main>

      <footer className="template-footer">
        <div className="template-footer-inner">
          {name ? <span>{name}</span> : null}
          <a href={hrefForPage('contact')}>{t('contact')}</a>
        </div>
      </footer>
    </div>
  );
}
