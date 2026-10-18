import {Types} from 'mongoose';

import {getDatabase} from '@/shared/db/mongodb';

import type {NewSite, SiteDocument} from './types/site';

const sitesCollection = 'sites';

export async function insertSite(site: NewSite): Promise<string> {
  const now = new Date();
  const result = await (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .insertOne({...site, _id: new Types.ObjectId(), createdAt: now, updatedAt: now});

  return result.insertedId.toString();
}

export async function findSiteByOwnerId(ownerUserId: string): Promise<SiteDocument | null> {
  return (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .findOne({ownerUserId});
}

export async function siteSlugExists(slug: string): Promise<boolean> {
  const site = await (await getDatabase())
    .collection<SiteDocument>(sitesCollection)
    .findOne({slug}, {projection: {_id: 1}});

  return site !== null;
}
