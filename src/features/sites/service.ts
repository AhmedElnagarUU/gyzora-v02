import type {StoredSiteData, TemplateId} from '@/features/templates/types';
import {duplicateKeyPattern, isDuplicateKeyError} from '@/shared/db/mongodb';
import {AppError} from '@/shared/http/app-error';

import {applyEdit, missingRequiredFields} from './apply-edit';
import {
  deleteSiteByOwnerId,
  findSiteByOwnerId,
  insertSite,
  siteSlugExists,
  updateSiteData,
} from './repository';
import type {CreateSiteValues} from './schemas/create-site-schema';
import type {SiteEditValues} from './schemas/update-site-schema';
import {siteDataFromValues} from './site-data';
import {buildSlugBase, findAvailableSlug, MAX_SLUG_ATTEMPTS} from './slug';
import type {SiteDocument, SiteStatus} from './types/site';

export interface CreatedSite {
  siteId: string;
  slug: string;
}

export interface SiteView {
  id: string;
  slug: string;
  status: SiteStatus;
  templateId: TemplateId;
  createdAt: Date;
  revision: number;
  data: StoredSiteData;
}

export async function createSiteForOwner(
  ownerUserId: string,
  values: CreateSiteValues
): Promise<CreatedSite> {
  const slugBase = buildSlugBase(values.companyName);

  for (let round = 0; round < MAX_SLUG_ATTEMPTS; round += 1) {
    const slug = await findAvailableSlug(slugBase, siteSlugExists);
    if (!slug) break;

    try {
      const siteId = await insertSite({
        ownerUserId,
        templateId: values.templateId,
        slug,
        slugLocked: false,
        status: 'draft',
        unpublishReason: null,
        data: siteDataFromValues(values),
        revision: 0,
        draftUpdatedAt: new Date(),
        published: null,
        trialStartedAt: null,
        billing: {manualProUntil: null, polar: null},
      });

      return {siteId, slug};
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;

      if (duplicateKeyPattern(error).includes('ownerUserId')) {
        throw new AppError('SITE_ALREADY_EXISTS', 409);
      }
    }
  }

  throw new AppError('INTERNAL', 500);
}

export async function getSiteForOwner(ownerUserId: string): Promise<SiteDocument | null> {
  return findSiteByOwnerId(ownerUserId);
}

export async function updateSiteForOwner(
  ownerUserId: string,
  revision: number,
  edit: SiteEditValues
): Promise<SiteView> {
  const current = await findSiteByOwnerId(ownerUserId);

  if (!current) {
    throw new AppError('NOT_FOUND', 404);
  }

  const data = applyEdit(current.data, edit);
  const issues = missingRequiredFields(data);

  if (Object.keys(issues).length) {
    throw new AppError('VALIDATION_FAILED', 400, issues);
  }

  const site = await updateSiteData(ownerUserId, revision, data);

  if (site) return toSiteView(site);

  throw new AppError('STALE_REVISION', 409);
}

export async function deleteSiteForOwner(ownerUserId: string): Promise<void> {
  const deleted = await deleteSiteByOwnerId(ownerUserId);

  if (!deleted) {
    throw new AppError('NOT_FOUND', 404);
  }
}

export function toSiteView(site: SiteDocument): SiteView {
  return {
    id: site._id.toString(),
    slug: site.slug,
    status: site.status,
    templateId: site.templateId,
    createdAt: site.createdAt,
    revision: site.revision,
    data: site.data,
  };
}
