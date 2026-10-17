import mongoose from 'mongoose';

import {getDbEnv} from '@/shared/config/env';

export async function getDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(getDbEnv().MONGODB_URL);
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB database connection is not ready.');
  }

  return db;
}
