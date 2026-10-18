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

export function getDisplayValue(value: LocalizedValue, locale: SiteLocale): string {
  const primary = value[locale].trim();

  if (primary) return primary;

  return value[locale === 'en' ? 'ar' : 'en'].trim();
}

export function toSiteLocale(locale: string): SiteLocale {
  return locale === 'ar' ? 'ar' : 'en';
}

function setLocalizedValue(
  value: LocalizedValue,
  locale: SiteLocale,
  text: string
): LocalizedValue {
  return locale === 'ar' ? {...value, ar: text} : {...value, en: text};
}

function mergeLocalizedItems(
  current: readonly LocalizedValue[],
  locale: SiteLocale,
  lines: readonly string[]
): LocalizedValue[] {
  const length = Math.max(current.length, lines.length);

  return Array.from({length}, (_, index) =>
    setLocalizedValue(current[index] ?? {en: '', ar: ''}, locale, lines[index] ?? '')
  );
}

export function siteSetupValuesFromProfile(
  profile: SiteProfile,
  locale: SiteLocale
): SiteSetupValues {
  const lines = (items: readonly LocalizedValue[]): string =>
    items
      .filter((item) => item[locale].trim())
      .map((item) => item[locale].trim())
      .join('\n');

  return {
    companyName: profile.companyName[locale],
    category: profile.category[locale],
    description: profile.description[locale],
    logoUrl: profile.logoUrl ?? '',
    contactEmail: profile.contact?.email ?? '',
    contactPhone: profile.contact?.phone ?? '',
    address: profile.contact?.address?.[locale] ?? '',
    services: lines(profile.services),
    features: lines(profile.features),
    languagePreferences: profile.languagePreferences.length
      ? [...profile.languagePreferences]
      : [locale],
    locale,
  };
}

export function mergeProfileEdit(
  current: SiteProfile,
  locale: SiteLocale,
  values: SiteSetupValues
): SiteProfile {
  const address = values.address.trim();
  const contact = {
    email: values.contactEmail.trim() || undefined,
    phone: values.contactPhone.trim() || undefined,
    address: address
      ? setLocalizedValue(current.contact?.address ?? {en: '', ar: ''}, locale, address)
      : undefined,
    workingHours: current.contact?.workingHours,
  };

  return {
    companyName: setLocalizedValue(current.companyName, locale, values.companyName.trim()),
    category: setLocalizedValue(current.category, locale, values.category.trim()),
    description: setLocalizedValue(current.description, locale, values.description.trim()),
    logoUrl: values.logoUrl.trim() || undefined,
    contact: Object.values(contact).some(Boolean) ? contact : undefined,
    services: mergeLocalizedItems(current.services, locale, splitLines(values.services)),
    features: mergeLocalizedItems(current.features, locale, splitLines(values.features)),
    languagePreferences: values.languagePreferences.length
      ? values.languagePreferences
      : current.languagePreferences,
  };
}

export function siteDataFromValues(values: SiteSetupValues): StoredSiteData {
  return {profile: siteProfileFromValues(values)};
}
