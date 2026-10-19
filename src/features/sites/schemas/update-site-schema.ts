import {z} from 'zod';

export const SITE_TEXT_LIMITS = {
  companyName: 80,
  category: 80,
  description: 600,
  about: 4000,
  address: 200,
  phone: 40,
  logoUrl: 500,
  listItem: 80,
  services: 12,
  features: 8,
} as const;

const VALIDATION = {
  maxLength: 'siteSetup.validation.maxLength',
  listTooMany: 'siteSetup.validation.listTooMany',
  languageRequired: 'siteSetup.validation.languageRequired',
  emailInvalid: 'siteSetup.validation.emailInvalid',
  phoneInvalid: 'siteSetup.validation.phoneInvalid',
  urlInvalid: 'siteSetup.validation.urlInvalid',
} as const;

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL_PATTERN = /^https?:\/\//i;

export function normalizeText(value: string): string {
  return value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARACTERS, '').trim();
}

function isLenientPhone(value: string): boolean {
  return value === '' || (value.length >= 5 && (value.match(/\p{Nd}/gu)?.length ?? 0) >= 3);
}

function isHttpUrl(value: string): boolean {
  if (value === '') return true;
  if (!HTTP_URL_PATTERN.test(value)) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const plainText = (max: number) =>
  z.string().transform(normalizeText).pipe(z.string().max(max, VALIDATION.maxLength));

const emailText = () =>
  plainText(200).refine((value) => value === '' || EMAIL_PATTERN.test(value), VALIDATION.emailInvalid);

const phoneText = () => plainText(SITE_TEXT_LIMITS.phone).refine(isLenientPhone, VALIDATION.phoneInvalid);

const urlText = () => plainText(SITE_TEXT_LIMITS.logoUrl).refine(isHttpUrl, VALIDATION.urlInvalid);

const localizedText = (max: number) =>
  z.object({en: plainText(max).optional(), ar: plainText(max).optional()}).strict();

const localizedList = (maxItems: number) =>
  z
    .array(
      z
        .object({
          en: plainText(SITE_TEXT_LIMITS.listItem),
          ar: plainText(SITE_TEXT_LIMITS.listItem),
        })
        .strict()
    )
    .max(maxItems, VALIDATION.listTooMany);

const contactSchema = z
  .object({
    email: emailText().optional(),
    phone: phoneText().optional(),
    address: localizedText(SITE_TEXT_LIMITS.address).optional(),
    workingHours: localizedText(SITE_TEXT_LIMITS.address).optional(),
  })
  .strict();

const profileSchema = z
  .object({
    companyName: localizedText(SITE_TEXT_LIMITS.companyName).optional(),
    category: localizedText(SITE_TEXT_LIMITS.category).optional(),
    description: localizedText(SITE_TEXT_LIMITS.description).optional(),
    logoUrl: urlText().optional(),
    contact: contactSchema.optional(),
    services: localizedList(SITE_TEXT_LIMITS.services).optional(),
    features: localizedList(SITE_TEXT_LIMITS.features).optional(),
    languagePreferences: z
      .array(z.enum(['en', 'ar']))
      .min(1, VALIDATION.languageRequired)
      .max(2, VALIDATION.listTooMany)
      .optional(),
  })
  .strict();

const aboutSchema = z
  .object({
    introduction: localizedText(SITE_TEXT_LIMITS.about).optional(),
    story: localizedText(SITE_TEXT_LIMITS.about).optional(),
  })
  .strict();

export const updateSiteSchema = z
  .object({
    revision: z.number().int().min(0),
    data: z
      .object({
        profile: profileSchema.optional(),
        pageCopy: z.object({about: aboutSchema.optional()}).strict().optional(),
      })
      .strict(),
  })
  .strict();

export type SiteEditValues = z.infer<typeof updateSiteSchema>['data'];
export type ProfileEditValues = NonNullable<SiteEditValues['profile']>;
export type ContactEditValues = NonNullable<ProfileEditValues['contact']>;
export type AboutEditValues = NonNullable<NonNullable<SiteEditValues['pageCopy']>['about']>;
export type LocalizedEditValues = {en?: string; ar?: string};
export type ListItemEditValues = {en: string; ar: string};
