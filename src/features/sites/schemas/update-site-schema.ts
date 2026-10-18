import {z} from 'zod';

const hasValue = (value: {en: string; ar: string}): boolean =>
  Boolean(value.en.trim() || value.ar.trim());

const localizedText = z.object({en: z.string().trim().max(2000), ar: z.string().trim().max(2000)});

const profileSchema = z
  .object({
    companyName: localizedText.refine(hasValue, 'siteSetup.validation.companyNameMin'),
    category: localizedText.refine(hasValue, 'siteSetup.validation.categoryMin'),
    description: localizedText,
    logoUrl: z.string().trim().url().or(z.literal('')).optional(),
    contact: z
      .object({
        email: z.string().trim().email().or(z.literal('')).optional(),
        phone: z.string().trim().max(2000).optional(),
        address: localizedText.optional(),
        workingHours: localizedText.optional(),
      })
      .strict()
      .optional(),
    services: z.array(localizedText),
    features: z.array(localizedText),
    languagePreferences: z.array(z.enum(['en', 'ar'])).min(1).max(2),
  })
  .strict();

export const updateSiteSchema = z
  .object({
    revision: z.number().int().min(0),
    data: z.object({profile: profileSchema}).strict(),
  })
  .strict();

export type UpdateSiteValues = z.infer<typeof updateSiteSchema>;
