import mongoose from 'mongoose';

import {getDbEnv} from '@/shared/config/env';

import {ensureIndexes} from './indexes';

let databasePromise: ReturnType<typeof initDatabase> | undefined;

const DUPLICATE_KEY_ERROR = 11000;

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as {code?: unknown}).code === DUPLICATE_KEY_ERROR
  );
}

async function initDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(getDbEnv().MONGODB_URL);
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB database connection is not ready.');
  }

  await ensureIndexes(db);

  return db;
}

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = initDatabase().catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}
