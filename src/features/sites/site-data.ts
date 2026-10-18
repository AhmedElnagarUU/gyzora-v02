import type {StoredSiteData} from '../templates/types';
import type {SiteSetupValues} from './schemas/create-site-schema';
import type {LocalizedValue, SiteLocale, SiteProfile} from './types/site';

export function localizedValue(value: string, locale: SiteLocale): LocalizedValue {
  return locale === 'ar' ? {en: '', ar: value} : {en: value, ar: ''};
}

export function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function siteProfileFromValues(values: SiteSetupValues): SiteProfile {
  const contact = {
    email: values.contactEmail || undefined,
    phone: values.contactPhone || undefined,
    address: values.address ? localizedValue(values.address, values.locale) : undefined,
  };

  return {
    companyName: localizedValue(values.companyName, values.locale),
    category: localizedValue(values.category, values.locale),
    description: localizedValue(values.description, values.locale),
    logoUrl: values.logoUrl || undefined,
    contact: Object.values(contact).some(Boolean) ? contact : undefined,
    services: splitLines(values.services).map((item) => localizedValue(item, values.locale)),
    features: splitLines(values.features).map((item) => localizedValue(item, values.locale)),
    languagePreferences: values.languagePreferences.length
      ? values.languagePreferences
      : [values.locale],
  };
}

export function siteDataFromValues(values: SiteSetupValues): StoredSiteData {
  return {profile: siteProfileFromValues(values)};
}
