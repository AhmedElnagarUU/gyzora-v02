import mongoose from 'mongoose';

export async function getDatabase() {
  if (mongoose.connection.readyState === 0) {
    const uri = process.env.MONGODB_URL;

    if (!uri) {
      throw new Error('MONGODB_URL is not configured.');
    }

    await mongoose.connect(uri);
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB database connection is not ready.');
  }

  return db;
}
