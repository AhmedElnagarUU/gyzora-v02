import type {StoredSiteData, TemplatePageCopy} from '@/features/templates/types';

import {
  normalizeText,
  type AboutEditValues,
  type ContactEditValues,
  type ListItemEditValues,
  type LocalizedEditValues,
  type ProfileEditValues,
  type SiteEditValues,
} from './schemas/update-site-schema.ts';
import type {LocalizedValue, SiteLocale, SiteProfile} from './types/site';

const EMPTY_LOCALIZED: LocalizedValue = {en: '', ar: ''};
const REQUIRED_MESSAGE = {
  companyName: 'siteSetup.validation.companyNameMin',
  category: 'siteSetup.validation.categoryMin',
} as const;

export interface EditorListItem {
  id: string;
  en: string;
  ar: string;
}

export interface EditorDraft {
  companyName: LocalizedValue;
  category: LocalizedValue;
  description: LocalizedValue;
  logoKey: string;
  email: string;
  phone: string;
  address: LocalizedValue;
  workingHours: LocalizedValue;
  aboutIntroduction: LocalizedValue;
  aboutStory: LocalizedValue;
  services: EditorListItem[];
  features: EditorListItem[];
  languagePreferences: SiteLocale[];
}

export function toEditorDraft(
  data: StoredSiteData,
  newId: () => string = () => crypto.randomUUID()
): EditorDraft {
  const item = (value: LocalizedValue): EditorListItem => ({id: newId(), ...value});

  return {
    companyName: {...data.profile.companyName},
    category: {...data.profile.category},
    description: {...data.profile.description},
    logoKey: data.profile.logoKey ?? '',
    email: data.profile.contact?.email ?? '',
    phone: data.profile.contact?.phone ?? '',
    address: {...(data.profile.contact?.address ?? EMPTY_LOCALIZED)},
    workingHours: {...(data.profile.contact?.workingHours ?? EMPTY_LOCALIZED)},
    aboutIntroduction: {...(data.pageCopy?.about?.introduction ?? EMPTY_LOCALIZED)},
    aboutStory: {...(data.pageCopy?.about?.story ?? EMPTY_LOCALIZED)},
    services: data.profile.services.map(item),
    features: data.profile.features.map(item),
    languagePreferences: data.profile.languagePreferences.length
      ? [...data.profile.languagePreferences]
      : ['en'],
  };
}

export function normalizeDraft(draft: EditorDraft): EditorDraft {
  const text = (value: LocalizedValue): LocalizedValue => ({
    en: normalizeText(value.en),
    ar: normalizeText(value.ar),
  });
  const items = (list: readonly EditorListItem[]): EditorListItem[] =>
    list.map((item) => ({id: item.id, en: normalizeText(item.en), ar: normalizeText(item.ar)}));

  return {
    companyName: text(draft.companyName),
    category: text(draft.category),
    description: text(draft.description),
    logoKey: normalizeText(draft.logoKey),
    email: normalizeText(draft.email),
    phone: normalizeText(draft.phone),
    address: text(draft.address),
    workingHours: text(draft.workingHours),
    aboutIntroduction: text(draft.aboutIntroduction),
    aboutStory: text(draft.aboutStory),
    services: items(draft.services),
    features: items(draft.features),
    languagePreferences: [...draft.languagePreferences],
  };
}

function changedLocalized(before: LocalizedValue, after: LocalizedValue): LocalizedEditValues | null {
  const edit: LocalizedEditValues = {};

  if (before.en !== after.en) edit.en = after.en;
  if (before.ar !== after.ar) edit.ar = after.ar;

  return edit.en === undefined && edit.ar === undefined ? null : edit;
}

function itemText(item: LocalizedValue): string[] {
  return [item.en, item.ar];
}

function changedList(before: readonly LocalizedValue[], after: readonly LocalizedValue[]): boolean {
  return JSON.stringify(before.map(itemText)) !== JSON.stringify(after.map(itemText));
}

export function buildEdit(draft: EditorDraft, baseline: EditorDraft): SiteEditValues {
  const profile: ProfileEditValues = {};
  const companyName = changedLocalized(baseline.companyName, draft.companyName);
  const category = changedLocalized(baseline.category, draft.category);
  const description = changedLocalized(baseline.description, draft.description);

  if (companyName) profile.companyName = companyName;
  if (category) profile.category = category;
  if (description) profile.description = description;
  if (baseline.logoKey !== draft.logoKey) profile.logoKey = draft.logoKey;

  const contact: ContactEditValues = {};
  const address = changedLocalized(baseline.address, draft.address);
  const workingHours = changedLocalized(baseline.workingHours, draft.workingHours);

  if (baseline.email !== draft.email) contact.email = draft.email;
  if (baseline.phone !== draft.phone) contact.phone = draft.phone;
  if (address) contact.address = address;
  if (workingHours) contact.workingHours = workingHours;
  if (Object.keys(contact).length) profile.contact = contact;

  if (changedList(baseline.services, draft.services)) {
    profile.services = draft.services.map((item) => ({en: item.en, ar: item.ar}));
  }

  if (changedList(baseline.features, draft.features)) {
    profile.features = draft.features.map((item) => ({en: item.en, ar: item.ar}));
  }

  if (JSON.stringify(baseline.languagePreferences) !== JSON.stringify(draft.languagePreferences)) {
    profile.languagePreferences = [...draft.languagePreferences];
  }

  const data: SiteEditValues = {};
  if (Object.keys(profile).length) data.profile = profile;

  const about: AboutEditValues = {};
  const introduction = changedLocalized(baseline.aboutIntroduction, draft.aboutIntroduction);
  const story = changedLocalized(baseline.aboutStory, draft.aboutStory);

  if (introduction) about.introduction = introduction;
  if (story) about.story = story;
  if (Object.keys(about).length) data.pageCopy = {about};

  return data;
}

function mergeLocalized(current: LocalizedValue, edit: LocalizedEditValues): LocalizedValue {
  return {
    en: edit.en === undefined ? current.en : edit.en,
    ar: edit.ar === undefined ? current.ar : edit.ar,
  };
}

function mergeContact(
  current: SiteProfile['contact'],
  edit: ContactEditValues
): SiteProfile['contact'] {
  const contact = {
    email: edit.email === undefined ? current?.email : edit.email || undefined,
    phone: edit.phone === undefined ? current?.phone : edit.phone || undefined,
    address: edit.address
      ? mergeLocalized(current?.address ?? EMPTY_LOCALIZED, edit.address)
      : current?.address,
    workingHours: edit.workingHours
      ? mergeLocalized(current?.workingHours ?? EMPTY_LOCALIZED, edit.workingHours)
      : current?.workingHours,
  };

  return Object.values(contact).some(Boolean) ? contact : undefined;
}

function mergeProfile(current: SiteProfile, edit: ProfileEditValues): SiteProfile {
  return {
    companyName: edit.companyName
      ? mergeLocalized(current.companyName, edit.companyName)
      : current.companyName,
    category: edit.category ? mergeLocalized(current.category, edit.category) : current.category,
    description: edit.description
      ? mergeLocalized(current.description, edit.description)
      : current.description,
    logoUrl: edit.logoKey === undefined ? current.logoUrl : undefined,
    logoKey: edit.logoKey === undefined ? current.logoKey : edit.logoKey || undefined,
    contact: edit.contact ? mergeContact(current.contact, edit.contact) : current.contact,
    services: edit.services ? edit.services.map(toStoredItem) : current.services,
    features: edit.features ? edit.features.map(toStoredItem) : current.features,
    languagePreferences: edit.languagePreferences
      ? [...edit.languagePreferences]
      : current.languagePreferences,
  };
}

function toStoredItem(item: ListItemEditValues): LocalizedValue {
  return {en: item.en, ar: item.ar};
}

function mergeAbout(
  current: TemplatePageCopy | undefined,
  edit: AboutEditValues
): TemplatePageCopy {
  const existing = current?.about;
  const introduction = edit.introduction
    ? mergeLocalized(existing?.introduction ?? EMPTY_LOCALIZED, edit.introduction)
    : existing?.introduction;
  const story = edit.story
    ? mergeLocalized(existing?.story ?? EMPTY_LOCALIZED, edit.story)
    : existing?.story;

  return {
    ...current,
    about: {
      ...(introduction ? {introduction} : {}),
      ...(story ? {story} : {}),
    },
  };
}

export function applyEdit(current: StoredSiteData, edit: SiteEditValues): StoredSiteData {
  const profile = edit.profile ? mergeProfile(current.profile, edit.profile) : current.profile;
  const about = edit.pageCopy?.about;
  const pageCopy = about ? mergeAbout(current.pageCopy, about) : current.pageCopy;

  return {
    ...current,
    profile,
    ...(pageCopy ? {pageCopy} : {}),
  };
}

export function missingRequiredFields(data: StoredSiteData): Record<string, string> {
  const fields: Record<string, string> = {};
  const missing = (value: LocalizedValue): boolean => !value.en.trim() && !value.ar.trim();

  if (missing(data.profile.companyName)) {
    fields['profile.companyName'] = REQUIRED_MESSAGE.companyName;
  }

  if (missing(data.profile.category)) {
    fields['profile.category'] = REQUIRED_MESSAGE.category;
  }

  return fields;
}
