import type {TemplateId} from '../templates/types';

export function buildTemplateContent(
  templateId: TemplateId,
  profile: {companyName: string; category: string; description: string}
) {
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
      }
    }
  };
}
