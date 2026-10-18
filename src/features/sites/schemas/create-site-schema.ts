import {z} from 'zod';
import {isTemplateId} from '../../templates/catalog.ts';

const optionalText = z.string().trim().max(2000).default('');
const optionalEmail = z.string().trim().email().or(z.literal('')).default('');
const optionalUrl = z.string().trim().url().or(z.literal('')).default('');

export const siteSetupSchema = z.object({
  companyName: z.string().trim().min(2, 'siteSetup.validation.companyNameMin'),
  category: z.string().trim().min(2, 'siteSetup.validation.categoryMin'),
  description: optionalText,
  logoUrl: optionalUrl,
  contactEmail: optionalEmail,
  contactPhone: optionalText,
  address: optionalText,
  services: optionalText,
  features: optionalText,
  languagePreferences: z.array(z.enum(['en', 'ar'])).max(2).default([]),
  locale: z.enum(['en', 'ar']),
});

export const createSiteSchema = siteSetupSchema
  .extend({
    templateId: z
      .string()
      .trim()
      .min(1, 'siteSetup.validation.templateRequired')
      .refine(isTemplateId, 'siteSetup.validation.templateInvalid'),
  })
  .strict();

export type SiteSetupValues = z.infer<typeof siteSetupSchema>;
export type CreateSiteValues = z.infer<typeof createSiteSchema>;
