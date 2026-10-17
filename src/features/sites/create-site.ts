import {createSite as insertSite, findSiteByOwnerId} from './repository';
import type {CreateSiteValues} from './schemas/create-site-schema';
import type {LocalizedValue, SiteLocale, SiteProfile} from './types/site';
import {buildTemplateContent} from './templates';

function localizedValue(value: string, locale: SiteLocale): LocalizedValue {
  return locale === 'ar' ? {en: '', ar: value} : {en: value, ar: ''};
}

function localizedList(value: string, locale: SiteLocale): LocalizedValue[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => localizedValue(item, locale));
}

function siteProfileFromValues(values: CreateSiteValues): SiteProfile {
  const contact = {
    email: values.contactEmail || undefined,
    phone: values.contactPhone || undefined,
    address: values.address ? localizedValue(values.address, values.locale) : undefined,
  };
  const hasContact = Object.values(contact).some(Boolean);

  return {
    companyName: localizedValue(values.companyName, values.locale),
    category: localizedValue(values.category, values.locale),
    description: localizedValue(values.description, values.locale),
    logoUrl: values.logoUrl || undefined,
    contact: hasContact ? contact : undefined,
    services: localizedList(values.services, values.locale),
    features: localizedList(values.features, values.locale),
    languagePreferences: values.languagePreferences.length
      ? values.languagePreferences
      : [values.locale],
  };
}

export async function createSiteForOwner(
  ownerUserId: string,
  values: CreateSiteValues
): Promise<{kind: 'created'; siteId: string} | {kind: 'already-exists'}> {
  const existingSite = await findSiteByOwnerId(ownerUserId);
  if (existingSite) return {kind: 'already-exists'};

  const siteId = await insertSite({
    ownerUserId,
    templateId: values.templateId,
    status: 'draft',
    profile: siteProfileFromValues(values),
    content: buildTemplateContent(values.templateId, {
      companyName: values.companyName,
      category: values.category,
      description: values.description,
      locale: values.locale,
    }),
  });

  return {kind: 'created', siteId};
}
