import {z} from 'zod';

import {IMAGE_KEY_PATTERN} from '../../images/keys.ts';
import {normalizeText} from '../../../shared/text/normalize.ts';

export const PROJECT_TEXT_LIMITS = {
  title: 80,
  description: 600,
  category: 80,
  location: 120,
  alt: 160,
  client: 120,
  key: 300,
  gallery: 12,
} as const;

export const PROJECT_VALIDATION = {
  maxLength: 'projects.validation.maxLength',
  invalidKey: 'projects.validation.invalidKey',
  yearRange: 'projects.validation.yearRange',
  areaPositive: 'projects.validation.areaPositive',
  galleryTooMany: 'projects.validation.galleryTooMany',
  titleRequired: 'projects.validation.titleRequired',
  featuredLimit: 'projects.validation.featuredLimit',
  uploadRejected: 'projects.validation.uploadRejected',
} as const;

const plainText = (max: number) =>
  z.string().transform(normalizeText).pipe(z.string().max(max, PROJECT_VALIDATION.maxLength));

const localizedText = (max: number) =>
  z.object({en: plainText(max), ar: plainText(max)}).strict();

const imageRefSchema = z
  .object({
    key: z.string().trim().max(PROJECT_TEXT_LIMITS.key).regex(IMAGE_KEY_PATTERN, PROJECT_VALIDATION.invalidKey),
    alt: localizedText(PROJECT_TEXT_LIMITS.alt),
  })
  .strict();

export const projectSchema = z
  .object({
    title: localizedText(PROJECT_TEXT_LIMITS.title),
    description: localizedText(PROJECT_TEXT_LIMITS.description),
    category: localizedText(PROJECT_TEXT_LIMITS.category),
    location: localizedText(PROJECT_TEXT_LIMITS.location),
    coverImage: imageRefSchema.nullable().optional(),
    gallery: z
      .array(imageRefSchema)
      .max(PROJECT_TEXT_LIMITS.gallery, PROJECT_VALIDATION.galleryTooMany)
      .default([]),
    metadata: z
      .object({
        year: z
          .number()
          .int(PROJECT_VALIDATION.yearRange)
          .min(1900, PROJECT_VALIDATION.yearRange)
          .max(2100, PROJECT_VALIDATION.yearRange)
          .optional(),
        areaSqm: z.number().positive(PROJECT_VALIDATION.areaPositive).optional(),
        client: plainText(PROJECT_TEXT_LIMITS.client).optional(),
      })
      .strict()
      .default({}),
    featured: z.boolean().default(false),
  })
  .strict();

export type ProjectInput = z.infer<typeof projectSchema>;
