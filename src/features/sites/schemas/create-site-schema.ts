import {z} from 'zod';
import {isTemplateId} from '../../templates/catalog.ts';

export const createSiteSchema = z.object({
  templateId: z
    .string()
    .trim()
    .min(1, 'siteSetup.validation.templateRequired')
    .refine(isTemplateId, 'siteSetup.validation.templateInvalid'),
  companyName: z.string().trim().min(2, 'siteSetup.validation.companyNameMin'),
  category: z.string().trim().min(2, 'siteSetup.validation.categoryMin'),
  description: z.string().trim().min(20, 'siteSetup.validation.descriptionMin'),
  languagePreferences: z
    .array(z.enum(['en', 'ar']))
    .min(1, 'siteSetup.validation.languageRequired')
    .max(2, 'siteSetup.validation.languageRequired')
    .default(['en'])
});

export type CreateSiteValues = z.infer<typeof createSiteSchema>;
