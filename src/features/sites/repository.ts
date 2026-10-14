import {getDatabase} from '@/shared/db/mongodb';

import type {NewSite, SiteDocument} from './types/site';

const sitesCollection = 'sites';

export async function createSite(site: NewSite): Promise<string> {
  const now = new Date();
  const result = await (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .insertOne({...site, createdAt: now, updatedAt: now});

  return result.insertedId.toString();
}

export async function findSiteByOwnerId(ownerUserId: string): Promise<SiteDocument | null> {
  return (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .findOne({ownerUserId});
}
