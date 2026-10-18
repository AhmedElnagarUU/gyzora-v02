import type mongoose from 'mongoose';

import {isDuplicateKeyError} from './mongodb';

type Database = NonNullable<typeof mongoose.connection.db>;

export async function ensureIndexes(db: Database): Promise<void> {
  const sites = db.collection('sites');

  try {
    await sites.createIndex({ownerUserId: 1}, {unique: true, name: 'ownerUserId_unique'});
    await sites.createIndex({slug: 1}, {unique: true, name: 'slug_unique'});
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error(
        'Cannot create the unique indexes on sites.ownerUserId and sites.slug: duplicate sites ' +
          'already exist. Remove the duplicate sites from the database (one site per owner and one ' +
          'site per slug) and restart.'
      );
    }

    throw error;
  }
}
