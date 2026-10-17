import {getDatabase, isDuplicateKeyError} from '@/shared/db/mongodb';
import {AppError} from '@/shared/http/app-error';

import type {NewSite, SiteDocument} from './types/site';

const sitesCollection = 'sites';

export async function createSite(site: NewSite): Promise<string> {
  const now = new Date();

  try {
    const result = await (await getDatabase())
      .collection<SiteDocument>(sitesCollection)
      .insertOne({...site, createdAt: now, updatedAt: now});

    return result.insertedId.toString();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new AppError('SITE_ALREADY_EXISTS', 409);
    }

    throw error;
  }
}

export async function findSiteByOwnerId(ownerUserId: string): Promise<SiteDocument | null> {
  return (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .findOne({ownerUserId});
}
