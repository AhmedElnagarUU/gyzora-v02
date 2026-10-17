import mongoose from 'mongoose';

import {getDbEnv} from '@/shared/config/env';

import {ensureIndexes} from './indexes';

let databasePromise: ReturnType<typeof initDatabase> | undefined;

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
