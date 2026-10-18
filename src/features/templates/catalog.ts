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
    name: {en: 'Editorial Atelier', ar: 'أتيلييه التحرير'},
    summary: {
      en: 'An editorial layout for design and architecture studios that lead with storytelling.',
      ar: 'تصميم تحريري يناسب استوديوهات التصميم والعمارة التي تعتمد على سرد القصة.',
    },
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
    images: {
      'home.hero': {
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        alt: {en: 'Atelier Interior Architecture', ar: 'عمارة أتيلييه الداخلية'},
      },
    },
  },
  {
    id: 'modern-build',
    name: {en: 'Modern Build', ar: 'البناء العصري'},
    summary: {
      en: 'A bold, structured layout for construction and engineering companies.',
      ar: 'تصميم جسور ومنظّم لشركات الإنشاءات والهندسة.',
    },
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
    images: {
      'home.hero': {
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        alt: {en: 'MODO Modular Architecture', ar: 'عمارة مودو المعيارية'},
      },
    },
  },
  {
    id: 'urban-estate',
    name: {en: 'Urban Estate', ar: 'العقارات الحضرية'},
    summary: {
      en: 'A refined layout for real estate developers and agencies presenting their projects.',
      ar: 'تصميم أنيق لشركات التطوير والتسويق العقاري لعرض مشاريعها.',
    },
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
    images: {
      'home.hero': {
        src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        alt: {en: 'Urban Estate Development', ar: 'تطوير أوربان إستيت العقاري'},
      },
    },
  },
  {
    id: 'interior-calm',
    name: {en: 'Interior Calm', ar: 'الهدوء الداخلي'},
    summary: {
      en: 'A soft, minimal layout for interior design and finishing studios.',
      ar: 'تصميم هادئ وبسيط لاستوديوهات التصميم الداخلي والتشطيبات.',
    },
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
    images: {
      'home.hero': {
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
        alt: {en: 'Interior Calm Minimalist Living', ar: 'مساحات إنتيريور كالم الهادئة'},
      },
    },
  },
  {
    id: 'craft-studio',
    name: {en: 'Craft Studio', ar: 'استوديو الحرفية'},
    summary: {
      en: 'A crafted, workshop-style layout for makers, fabricators and artisans.',
      ar: 'تصميم حرفي بأسلوب الورش للمصنّعين والحرفيين.',
    },
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
    images: {
      'home.hero': {
        src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
        alt: {en: 'Craft Studio Architectural Fabrication', ar: 'أعمال كرافت ستوديو المعمارية'},
      },
    },
  },
];

for (const template of TEMPLATES) {
  for (const page of template.pages) {
    for (const sectionDefinition of page.sections) {
      Object.freeze(sectionDefinition.fieldIds);
      Object.freeze(sectionDefinition.imageSlotIds);
      Object.freeze(sectionDefinition);
    }
    Object.freeze(page.sections);
    Object.freeze(page);
  }
  Object.freeze(template.pages);
  if (template.images) {
    for (const image of Object.values(template.images)) {
      if (!image) continue;
      Object.freeze(image.alt);
      Object.freeze(image);
    }
    Object.freeze(template.images);
  }
  Object.freeze(template.name);
  Object.freeze(template.summary);
  Object.freeze(template.style);
  Object.freeze(template);
}

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
