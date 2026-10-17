import type mongoose from 'mongoose';

type Database = NonNullable<typeof mongoose.connection.db>;

const DUPLICATE_KEY_ERROR = 11000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as {code?: unknown}).code === DUPLICATE_KEY_ERROR
  );
}

export async function ensureIndexes(db: Database): Promise<void> {
  try {
    await db.collection('sites').createIndex(
      {ownerUserId: 1},
      {unique: true, name: 'ownerUserId_unique'}
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error(
        'Cannot create the unique index sites.ownerUserId: duplicate sites already exist. ' +
          'Remove the duplicate sites from the database (one site per owner) and restart.'
      );
    }

    throw error;
  }
}
