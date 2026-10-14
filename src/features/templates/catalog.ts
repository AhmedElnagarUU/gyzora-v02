import type {
  TemplateDefinition,
  TemplateFieldId,
  TemplateImageSlotId,
  TemplateId,
  TemplatePageDefinition,
  TemplateSectionDefinition,
  TemplateSectionType,
} from './types';

function section(
  id: string,
  type: TemplateSectionType,
  fieldIds: readonly TemplateFieldId[] = [],
  imageSlotIds: readonly TemplateImageSlotId[] = []
): TemplateSectionDefinition {
  return {id, type, fieldIds, imageSlotIds};
}

const PAGES: readonly TemplatePageDefinition[] = [
  {
    id: 'home',
    slug: '',
    labelKey: 'home',
    sections: [
      section('hero', 'hero', ['profile.companyName', 'profile.description'], ['site.logo', 'home.hero']),
      section('introduction', 'introduction', ['home.introduction', 'profile.description']),
      section('services', 'services', ['profile.services']),
      section('featured-projects', 'featured-projects', ['projects.collection'], ['project.cover']),
      section('capabilities', 'capabilities', ['profile.features']),
      section('process', 'process', ['home.processSteps']),
      section('call-to-action', 'call-to-action', ['home.callToAction']),
      section('contact-summary', 'contact-summary', ['profile.contact']),
    ],
  },
  {
    id: 'about',
    slug: 'about',
    labelKey: 'about',
    sections: [
      section('introduction', 'introduction', ['about.introduction', 'profile.description']),
      section('story', 'story', ['about.story']),
      section('capabilities', 'capabilities', ['profile.features']),
    ],
  },
  {
    id: 'services',
    slug: 'services',
    labelKey: 'services',
    sections: [
      section('introduction', 'introduction', ['services.introduction', 'profile.description']),
      section('service-list', 'service-list', ['profile.services']),
    ],
  },
  {
    id: 'projects',
    slug: 'projects',
    labelKey: 'projects',
    sections: [
      section('introduction', 'introduction', ['projects.introduction', 'profile.description']),
      section('project-list', 'project-list', ['projects.collection'], ['project.cover']),
    ],
  },
  {
    id: 'project-details',
    slug: 'projects',
    labelKey: 'projects',
    sections: [
      section(
        'project-hero',
        'project-hero',
        ['project.title', 'project.category', 'project.location'],
        ['project.cover']
      ),
      section('project-description', 'project-description', ['project.description']),
      section('project-gallery', 'project-gallery', ['project.gallery'], ['project.gallery']),
    ],
  },
  {
    id: 'contact',
    slug: 'contact',
    labelKey: 'contact',
    sections: [
      section('introduction', 'introduction', ['contact.introduction', 'profile.description']),
      section('contact-methods', 'contact-methods', ['profile.contact']),
    ],
  },
];

export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: 'atelier',
    style: {
      accent: '#9B4C31',
      accentForeground: '#FFFFFF',
      background: '#F5F0E8',
      surface: '#FCFAF6',
      foreground: '#28231F',
      muted: '#756B62',
      border: '#DED4C8',
      radius: '0.75rem',
      fontStyle: 'editorial',
    },
    pages: PAGES,
  },
  {
    id: 'modern-build',
    style: {
      accent: '#B64C20',
      accentForeground: '#FFFFFF',
      background: '#172638',
      surface: '#203246',
      foreground: '#F4F6F8',
      muted: '#B9C5D0',
      border: '#3A4C5E',
      radius: '0.25rem',
      fontStyle: 'geometric',
    },
    pages: PAGES,
  },
  {
    id: 'urban-estate',
    style: {
      accent: '#A6874A',
      accentForeground: '#1D3029',
      background: '#F3F1EB',
      surface: '#FBFAF6',
      foreground: '#1D3029',
      muted: '#69736B',
      border: '#DAD8CC',
      radius: '0.35rem',
      fontStyle: 'refined',
    },
    pages: PAGES,
  },
  {
    id: 'interior-calm',
    style: {
      accent: '#78866C',
      accentForeground: '#252A23',
      background: '#F5F3EC',
      surface: '#FCFBF7',
      foreground: '#2D332D',
      muted: '#73786E',
      border: '#DFDED3',
      radius: '1.25rem',
      fontStyle: 'soft',
    },
    pages: PAGES,
  },
  {
    id: 'craft-studio',
    style: {
      accent: '#C18468',
      accentForeground: '#202222',
      background: '#202222',
      surface: '#292C2C',
      foreground: '#F1F0EB',
      muted: '#B4B4AC',
      border: '#454746',
      radius: '0.4rem',
      fontStyle: 'studio',
    },
    pages: PAGES,
  },
];

export function getTemplate(templateId: string): TemplateDefinition | null {
  return TEMPLATES.find((template) => template.id === templateId) ?? null;
}

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATES.some((template) => template.id === value);
}

export function getTemplatePage(
  template: TemplateDefinition,
  pageId: string
): TemplatePageDefinition | null {
  return template.pages.find((page) => page.id === pageId) ?? null;
}

export function getTemplatePageBySlug(
  template: TemplateDefinition,
  slug: string
): TemplatePageDefinition | null {
  return template.pages.find((page) => page.slug === slug) ?? null;
}

export function getTemplateFieldIds(
  template: TemplateDefinition,
  pageId: TemplatePageDefinition['id']
): readonly TemplateFieldId[] {
  const page = getTemplatePage(template, pageId);
  if (!page) return [];
  return [...new Set(page.sections.flatMap((sectionDefinition) => sectionDefinition.fieldIds))];
}

export function getTemplateImageSlotIds(
  template: TemplateDefinition,
  pageId: TemplatePageDefinition['id']
): readonly TemplateImageSlotId[] {
  const page = getTemplatePage(template, pageId);
  if (!page) return [];
  return [...new Set(page.sections.flatMap((sectionDefinition) => sectionDefinition.imageSlotIds))];
}
