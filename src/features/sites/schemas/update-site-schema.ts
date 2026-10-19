import {z} from 'zod';

import {normalizeText} from '../../../shared/text/normalize.ts';

export {normalizeText};

export const SITE_TEXT_LIMITS = {
  companyName: 80,
  category: 80,
  description: 600,
  about: 4000,
  address: 200,
  phone: 40,
  logoKey: 300,
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
  logoKeyInvalid: 'siteSetup.validation.logoKeyInvalid',
  emptyEdit: 'siteSetup.validation.emptyEdit',
} as const;

const EMAIL_PATTERN = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^$|^[\p{Nd}+\-()\s.]{5,40}$/u;

const plainText = (max: number) =>
  z.string().transform(normalizeText).pipe(z.string().max(max, VALIDATION.maxLength));

const matchingText = (max: number, pattern: RegExp, message: string) =>
  z
    .string()
    .transform(normalizeText)
    .pipe(z.string().max(max, VALIDATION.maxLength).regex(pattern, message));

const emailText = () => matchingText(200, EMAIL_PATTERN, VALIDATION.emailInvalid);

const phoneText = () => matchingText(SITE_TEXT_LIMITS.phone, PHONE_PATTERN, VALIDATION.phoneInvalid);

const logoKeyText = () =>

  z
    .string()
    .transform(normalizeText)
    .pipe(
      z
        .string()
        .max(SITE_TEXT_LIMITS.logoKey, VALIDATION.maxLength)
        .regex(/^$|^sites\/[0-9a-f]{24}\/logo\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/, VALIDATION.logoKeyInvalid)
    );

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
    logoKey: logoKeyText().optional(),
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
      .strict()
      .refine((data) => Object.keys(data).length > 0, VALIDATION.emptyEdit),
  })
  .strict();

export type SiteEditValues = z.infer<typeof updateSiteSchema>['data'];
export type ProfileEditValues = NonNullable<SiteEditValues['profile']>;
export type ContactEditValues = NonNullable<ProfileEditValues['contact']>;
export type AboutEditValues = NonNullable<NonNullable<SiteEditValues['pageCopy']>['about']>;
export type LocalizedEditValues = {en?: string; ar?: string};
export type ListItemEditValues = {en: string; ar: string};
