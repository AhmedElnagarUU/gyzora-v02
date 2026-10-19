import type {StoredSiteData} from '@/features/templates/types';
import {getDatabase} from '@/shared/db/mongodb';

import {SiteModel} from './model';
import type {NewSite, SiteDocument} from './types/site';

export async function insertSite(site: NewSite): Promise<string> {
  await getDatabase();
  const created = await SiteModel.create(site);

  return created._id.toString();
}

export async function findSiteByOwnerId(ownerUserId: string): Promise<SiteDocument | null> {
  await getDatabase();
  const site = await SiteModel.findOne({ownerUserId}).lean<SiteDocument>().exec();

  return site ?? null;
}

export async function siteSlugExists(slug: string): Promise<boolean> {
  await getDatabase();
  const site = await SiteModel.exists({slug});

  return site !== null;
}

export async function updateSiteData(
  ownerUserId: string,
  revision: number,
  data: StoredSiteData
): Promise<SiteDocument | null> {
  await getDatabase();
  const site = await SiteModel.findOneAndUpdate(
    {ownerUserId, revision},
    {$set: {data, draftUpdatedAt: new Date()}, $inc: {revision: 1}},
    {new: true}
  )
    .lean<SiteDocument>()
    .exec();

  return site ?? null;
}

export async function deleteSiteByOwnerId(ownerUserId: string): Promise<boolean> {
  await getDatabase();
  const result = await SiteModel.deleteOne({ownerUserId}).exec();

  return result.deletedCount === 1;
}

// Used by project writes (S4) so the draft timestamp stays in sync.
export async function touchDraft(siteId: string): Promise<void> {
  await getDatabase();
  await SiteModel.updateOne({_id: siteId}, {$set: {draftUpdatedAt: new Date()}}).exec();
}
