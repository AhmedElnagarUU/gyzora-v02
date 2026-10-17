import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import type {LocalizedValue, SiteLocale} from '@/features/sites/types/site';
import type {
  TemplatePageId,
  TemplateImage,
  TemplateProject,
  TemplateSectionDefinition,
  TemplateSiteData,
} from '../types';
import {TemplateImageFrame} from './TemplateImageFrame';
import {getLocalizedText, getVisibleProjects} from './localized';

function PageIntroduction({
  pageId,
  locale,
  site,
}: {
  pageId: TemplatePageId;
  locale: SiteLocale;
  site: TemplateSiteData;
}) {
  const copy = site.pageCopy;
  const introduction =
    pageId === 'about'
      ? copy?.about?.introduction
      : pageId === 'services'
        ? copy?.services?.introduction
        : pageId === 'projects'
          ? copy?.projects?.introduction
          : pageId === 'contact'
            ? copy?.contact?.introduction
            : copy?.home?.introduction;
  const description =
    getLocalizedText(introduction, locale) ||
    (pageId === 'home' ? '' : getLocalizedText(site.profile.description, locale));
  const t = useTranslations('landing.nav');
  const heading = pageId === 'project-details' ? 'projects' : pageId;

  if (!description) return null;

  return (
    <section className="template-section template-introduction" id={`${pageId}-introduction`}>
      <div className="template-section-inner">
        <h2 className="template-section-heading">{t(heading)}</h2>
        <p className="template-lead">{description}</p>
      </div>
    </section>
  );
}

function ServiceItems({
  title,
  values,
  locale,
}: {
  title: string;
  values: readonly LocalizedValue[];
  locale: SiteLocale;
}) {
  const items = values.map((value) => getLocalizedText(value, locale)).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section className="template-section template-services" id="services">
      <div className="template-section-inner">
        <h2 className="template-section-heading">{title}</h2>
        <ul className="template-service-list">
          {items.map((item, index) => (
            <li className="template-service-item" key={`${index}-${item}`}>
              <span className="template-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCards({
  projects,
  locale,
  hrefForProject,
  featured,
}: {
  projects: readonly TemplateProject[];
  locale: SiteLocale;
  hrefForProject: (projectId: string) => string;
  featured: boolean;
}) {
  const t = useTranslations('landing.nav');
  const availableProjects = getVisibleProjects(projects, locale);
  if (availableProjects.length === 0) return null;

  return (
    <section className="template-section template-projects" id={featured ? 'featured-projects' : 'projects'}>
      <div className="template-section-inner">
        <h2 className="template-section-heading">{t('projects')}</h2>
        <div className="template-project-grid">
          {availableProjects.map((project) => (
            <a
              className="template-project-card"
              href={hrefForProject(project.id)}
              key={project.id}
            >
              {project.coverImage ? (
                <TemplateImageFrame
                  image={project.coverImage}
                  locale={locale}
                  className="template-project-image"
                />
              ) : (
                <div className="template-image-placeholder template-project-image" aria-hidden="true" />
              )}
              <span className="template-project-copy">
                <span className="template-project-title">{getLocalizedText(project.title, locale)}</span>
                <span className="template-project-specs">
                  {getLocalizedText(project.category, locale) ? (
                    <span className="template-project-meta">{getLocalizedText(project.category, locale)}</span>
                  ) : null}
                  {getLocalizedText(project.location, locale) ? (
                    <span>{getLocalizedText(project.location, locale)}</span>
                  ) : null}
                  {project.year ? <span>{project.year}</span> : null}
                  {getLocalizedText(project.area, locale) ? (
                    <span>{getLocalizedText(project.area, locale)}</span>
                  ) : null}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({
  site,
  locale,
}: {
  site: TemplateSiteData;
  locale: SiteLocale;
}) {
  const t = useTranslations('landing.nav');
  const features = site.profile.features
    .map((feature) => getLocalizedText(feature, locale))
    .filter(Boolean);
  if (features.length === 0) return null;

  return (
    <section className="template-section template-capabilities" id="capabilities">
      <div className="template-section-inner">
        <h2 className="template-section-heading">{t('about')}</h2>
        <ul className="template-feature-list">
          {features.map((feature, index) => (
            <li key={`${index}-${feature}`}>{feature}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProcessSteps({
  steps,
  locale,
}: {
  steps: readonly LocalizedValue[] | undefined;
  locale: SiteLocale;
}) {
  const t = useTranslations('landing.nav');
  const items = (steps ?? [])
    .map((step) => getLocalizedText(step, locale))
    .filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section className="template-section template-process" id="process">
      <div className="template-section-inner">
        <h2 className="template-section-heading">{t('howItWorks')}</h2>
        <ol className="template-process-list">
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>
              <span className="template-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CallToAction({
  title,
  locale,
  href,
}: {
  title: LocalizedValue | undefined;
  locale: SiteLocale;
  href: string;
}) {
  const t = useTranslations('landing.nav');
  const text = getLocalizedText(title, locale);

  return (
    <section className="template-section template-call-to-action" id="call-to-action">
      <div className="template-section-inner template-cta-inner">
        {text ? <h2 className="template-section-heading">{text}</h2> : null}
        <a className="template-button" href={href}>
          {t('contact')}
        </a>
      </div>
    </section>
  );
}

function ContactDetails({
  site,
  locale,
  compact = false,
}: {
  site: TemplateSiteData;
  locale: SiteLocale;
  compact?: boolean;
}) {
  const t = useTranslations('landing.nav');
  const tContact = useTranslations('templatePreview.contact');
  const contact = site.profile.contact;
  const address = getLocalizedText(contact?.address, locale);
  const workingHours = getLocalizedText(contact?.workingHours, locale);
  const details: {label: 'email' | 'phone' | 'address' | 'workingHours'; value: string; href?: string}[] = [];
  if (contact?.email) details.push({label: 'email', value: contact.email, href: `mailto:${contact.email}`});
  if (contact?.phone) details.push({label: 'phone', value: contact.phone, href: `tel:${contact.phone}`});
  if (address) details.push({label: 'address', value: address});
  if (workingHours) details.push({label: 'workingHours', value: workingHours});

  if (details.length === 0) return null;

  return (
    <section
      className={`template-section template-contact ${compact ? 'template-contact-compact' : ''}`}
      id={compact ? 'contact-summary' : 'contact-methods'}
    >
      <div className="template-section-inner">
        <h2 className="template-section-heading">{t('contact')}</h2>
        <ul className="template-contact-list">
          {details.map((detail) => (
            <li key={detail.label} className="template-contact-item">
              <span className="template-contact-label">{tContact(detail.label)}:</span>
              {detail.href ? <a href={detail.href}>{detail.value}</a> : <span>{detail.value}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectHero({
  project,
  locale,
}: {
  project: TemplateProject;
  locale: SiteLocale;
}) {
  const tSpecs = useTranslations('templatePreview.specs');
  const title = getLocalizedText(project.title, locale);
  if (!title) return null;
  const category = getLocalizedText(project.category, locale);
  const location = getLocalizedText(project.location, locale);
  const year = project.year;
  const area = getLocalizedText(project.area, locale);

  return (
    <section className="template-section template-project-hero">
      <div className="template-section-inner">
        {project.coverImage ? (
          <TemplateImageFrame image={project.coverImage} locale={locale} className="template-project-cover" />
        ) : null}
        <h1 className="template-page-title">{title}</h1>
        {(category || location || year || area) ? (
          <div className="template-project-specs-grid">
            {category ? (
              <div className="template-spec-item">
                <span className="template-spec-label">{tSpecs('category')}</span>
                <span className="template-spec-value">{category}</span>
              </div>
            ) : null}
            {location ? (
              <div className="template-spec-item">
                <span className="template-spec-label">{tSpecs('location')}</span>
                <span className="template-spec-value">{location}</span>
              </div>
            ) : null}
            {year ? (
              <div className="template-spec-item">
                <span className="template-spec-label">{tSpecs('year')}</span>
                <span className="template-spec-value">{year}</span>
              </div>
            ) : null}
            {area ? (
              <div className="template-spec-item">
                <span className="template-spec-label">{tSpecs('area')}</span>
                <span className="template-spec-value">{area}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectDescription({
  project,
  locale,
}: {
  project: TemplateProject;
  locale: SiteLocale;
}) {
  const description = getLocalizedText(project.description, locale);
  if (!description) return null;

  return (
    <section className="template-section template-project-description">
      <div className="template-section-inner">
        <p className="template-lead">{description}</p>
      </div>
    </section>
  );
}

function ProjectGallery({
  project,
  locale,
}: {
  project: TemplateProject;
  locale: SiteLocale;
}) {
  const images = project.gallery ?? [];
  if (images.length === 0) return null;

  return (
    <section className="template-section template-project-gallery">
      <div className="template-section-inner template-project-grid">
        {images.map((image, index) => (
          <TemplateImageFrame
            image={image}
            locale={locale}
            className="template-gallery-image"
            key={`${image.src}-${index}`}
          />
        ))}
      </div>
    </section>
  );
}

function Story({
  site,
  locale,
}: {
  site: TemplateSiteData;
  locale: SiteLocale;
}) {
  const story = getLocalizedText(site.pageCopy?.about?.story, locale);
  if (!story) return null;

  return (
    <section className="template-section template-story" id="story">
      <div className="template-section-inner">
        <p className="template-lead">{story}</p>
      </div>
    </section>
  );
}

export function TemplateSection({
  definition,
  pageId,
  site,
  locale,
  project,
  hrefForProject,
  hrefForContact,
  heroImage,
}: {
  definition: TemplateSectionDefinition;
  pageId: TemplatePageId;
  site: TemplateSiteData;
  locale: SiteLocale;
  project?: TemplateProject;
  hrefForProject: (projectId: string) => string;
  hrefForContact: string;
  heroImage?: TemplateImage;
}): ReactNode {
  const t = useTranslations('landing.nav');

  switch (definition.type) {
    case 'hero': {
      const name = getLocalizedText(site.profile.companyName, locale);
      const category = getLocalizedText(site.profile.category, locale);
      const description = getLocalizedText(site.profile.description, locale);
      const featurePills = site.profile.features
        .map((feature) => getLocalizedText(feature, locale))
        .filter(Boolean);
      if (!name && !category && !description) return null;

      return (
        <section className="template-section template-hero" id="hero">
          <div className="template-section-inner template-hero-inner">
            {heroImage ? (
              <TemplateImageFrame image={heroImage} locale={locale} className="template-hero-image" />
            ) : (
              <div className="template-image-placeholder template-hero-image" aria-hidden="true" />
            )}
            <div className="template-hero-copy">
              {name ? <h1 className="template-page-title">{name}</h1> : null}
              {category ? <p className="template-hero-category">{category}</p> : null}
              {description ? <p className="template-lead">{description}</p> : null}
              {featurePills.length > 0 ? (
                <div className="template-hero-pills" aria-label="Key highlights">
                  {featurePills.slice(0, 4).map((pill, index) => (
                    <span className="template-hero-pill" key={`${index}-${pill}`}>
                      {pill}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="template-hero-actions">
                <a className="template-button" href={hrefForContact}>
                  {t('contact')}
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }
    case 'introduction':
      return <PageIntroduction pageId={pageId} locale={locale} site={site} />;
    case 'services':
    case 'service-list':
      return (
        <ServiceItems
          title={t('services')}
          values={site.profile.services}
          locale={locale}
        />
      );
    case 'featured-projects':
    case 'project-list':
      return (
        <ProjectCards
          projects={site.projects ?? []}
          locale={locale}
          hrefForProject={hrefForProject}
          featured={definition.type === 'featured-projects'}
        />
      );
    case 'capabilities':
      return <Capabilities site={site} locale={locale} />;
    case 'process':
      return <ProcessSteps steps={site.pageCopy?.home?.processSteps} locale={locale} />;
    case 'call-to-action':
      return (
        <CallToAction
          title={site.pageCopy?.home?.callToAction}
          locale={locale}
          href={hrefForContact}
        />
      );
    case 'contact-summary':
      return <ContactDetails site={site} locale={locale} compact />;
    case 'story':
      return <Story site={site} locale={locale} />;
    case 'project-hero':
      return project ? <ProjectHero project={project} locale={locale} /> : null;
    case 'project-description':
      return project ? <ProjectDescription project={project} locale={locale} /> : null;
    case 'project-gallery':
      return project ? <ProjectGallery project={project} locale={locale} /> : null;
    case 'contact-methods':
      return <ContactDetails site={site} locale={locale} />;
    default:
      throw new Error(`Unsupported template section type "${String(definition.type)}".`);
  }
}
