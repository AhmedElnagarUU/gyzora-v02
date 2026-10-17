import type {SiteLocale} from './types/site';
import type {TemplateId} from '../templates/types';

export function buildTemplateContent(
  templateId: TemplateId,
  profile: {companyName: string; category: string; description: string; locale: SiteLocale}
) {
  const localized = (value: string) =>
    profile.locale === 'ar' ? {en: '', ar: value} : {en: value, ar: ''};

  return {
    templateId,
    language: profile.locale,
    sections: {
      hero: {
        heading: localized(profile.companyName),
        subheading: localized(profile.category),
        description: localized(profile.description)
      },
      about: {
        title: {
          en: 'About us',
          ar: 'من نحن'
        },
        description: localized(profile.description)
      },
      services: {
        title: {
          en: 'Services',
          ar: 'الخدمات'
        },
        items: []
      }
    }
  };
}
