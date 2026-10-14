import type {LocalizedValue, SiteLocale, SiteProfile} from '@/features/sites/types/site';

export type TemplateId =
  | 'atelier'
  | 'modern-build'
  | 'urban-estate'
  | 'interior-calm'
  | 'craft-studio';

export type TemplatePageId =
  | 'home'
  | 'about'
  | 'services'
  | 'projects'
  | 'project-details'
  | 'contact';

export type TemplateNavigationLabel = 'home' | 'about' | 'services' | 'projects' | 'contact';

export type TemplateSectionType =
  | 'hero'
  | 'introduction'
  | 'services'
  | 'featured-projects'
  | 'capabilities'
  | 'process'
  | 'call-to-action'
  | 'contact-summary'
  | 'story'
  | 'service-list'
  | 'project-list'
  | 'project-hero'
  | 'project-description'
  | 'project-gallery'
  | 'contact-methods';

export type TemplateFieldId =
  | 'profile.companyName'
  | 'profile.description'
  | 'profile.services'
  | 'profile.features'
  | 'profile.contact'
  | 'profile.logoUrl'
  | 'home.introduction'
  | 'home.processSteps'
  | 'home.callToAction'
  | 'about.introduction'
  | 'about.story'
  | 'services.introduction'
  | 'projects.introduction'
  | 'projects.collection'
  | 'project.title'
  | 'project.description'
  | 'project.category'
  | 'project.location'
  | 'project.gallery'
  | 'contact.introduction';

export type TemplateImageSlotId = 'site.logo' | 'home.hero' | 'project.cover' | 'project.gallery';

export interface TemplateSectionDefinition {
  readonly id: string;
  readonly type: TemplateSectionType;
  readonly fieldIds: readonly TemplateFieldId[];
  readonly imageSlotIds: readonly TemplateImageSlotId[];
}

export interface TemplatePageDefinition {
  readonly id: TemplatePageId;
  readonly slug: string;
  readonly labelKey: TemplateNavigationLabel;
  readonly sections: readonly TemplateSectionDefinition[];
}

export type TemplateFontStyle = 'editorial' | 'geometric' | 'refined' | 'soft' | 'studio';

export interface TemplateStyle {
  readonly accent: string;
  readonly accentForeground: string;
  readonly background: string;
  readonly surface: string;
  readonly foreground: string;
  readonly muted: string;
  readonly border: string;
  readonly radius: string;
  readonly fontStyle: TemplateFontStyle;
}

export interface TemplateDefinition {
  readonly id: TemplateId;
  readonly style: TemplateStyle;
  readonly pages: readonly TemplatePageDefinition[];
  readonly images?: Partial<Record<TemplateImageSlotId, TemplateImage>>;
}

export interface TemplateImage {
  readonly src: string;
  readonly alt: LocalizedValue;
}

export interface TemplateProject {
  readonly id: string;
  readonly title: LocalizedValue;
  readonly description: LocalizedValue;
  readonly category?: LocalizedValue;
  readonly location?: LocalizedValue;
  readonly coverImage?: TemplateImage;
  readonly gallery?: readonly TemplateImage[];
}

export interface TemplatePageCopy {
  readonly home?: {
    readonly introduction?: LocalizedValue;
    readonly processSteps?: readonly LocalizedValue[];
    readonly callToAction?: LocalizedValue;
  };
  readonly about?: {
    readonly introduction?: LocalizedValue;
    readonly story?: LocalizedValue;
  };
  readonly services?: {
    readonly introduction?: LocalizedValue;
  };
  readonly projects?: {
    readonly introduction?: LocalizedValue;
  };
  readonly contact?: {
    readonly introduction?: LocalizedValue;
  };
}

export interface TemplateSiteData {
  readonly profile: SiteProfile;
  readonly pageCopy?: TemplatePageCopy;
  readonly projects?: readonly TemplateProject[];
}

export type TemplatePageHref = (
  pageId: TemplatePageId,
  projectId?: string
) => string;

export type TemplateRenderMode = 'sample' | 'draft' | 'published';

interface TemplateRendererBaseProps {
  template: TemplateDefinition;
  site: TemplateSiteData;
  locale: SiteLocale;
  mode: TemplateRenderMode;
  hrefForPage: TemplatePageHref;
}

export type SitePageRendererProps = TemplateRendererBaseProps &
  (
    | {pageId: 'project-details'; project: TemplateProject}
    | {pageId: Exclude<TemplatePageId, 'project-details'>; project?: never}
  );
