export const SITE_TEMPLATES = {
  modern: {
    id: 'modern',
    title: {en: 'Modern Studio', ar: 'استوديو عصري'},
    accent: {en: 'For a polished, conversion-focused profile', ar: 'لملف شخصي احترافي يركز على التحويل'}
  },
  boutique: {
    id: 'boutique',
    title: {en: 'Boutique Portfolio', ar: 'ملف أعمال فاخر'},
    accent: {en: 'For a warm, service-led brand story', ar: 'لرواية علامة تجارية دافئة وموجهة للخدمة'}
  }
} as const;

export type SiteTemplateId = keyof typeof SITE_TEMPLATES;

export function getTemplateById(templateId?: string) {
  if (!templateId || !(templateId in SITE_TEMPLATES)) {
    return null;
  }

  return SITE_TEMPLATES[templateId as SiteTemplateId];
}

export function buildTemplateContent(templateId: SiteTemplateId, profile: {companyName: string; category: string; description: string}) {
  const template = SITE_TEMPLATES[templateId];

  return {
    templateId,
    language: 'en',
    sections: {
      hero: {
        heading: {
          en: profile.companyName,
          ar: profile.companyName
        },
        subheading: {
          en: profile.category,
          ar: profile.category
        },
        description: {
          en: profile.description,
          ar: profile.description
        }
      },
      about: {
        title: {
          en: 'About us',
          ar: 'من نحن'
        },
        description: {
          en: profile.description,
          ar: profile.description
        }
      },
      services: {
        title: {
          en: 'Services',
          ar: 'الخدمات'
        },
        items: [{
          title: {en: profile.category, ar: profile.category},
          description: {en: profile.description, ar: profile.description}
        }]
      },
      templateMeta: {
        id: template.id,
        label: template.title,
        accent: template.accent
      }
    }
  };
}
