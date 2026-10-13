import mongoose from 'mongoose';
import {betterAuth} from 'better-auth';
import {mongodbAdapter} from 'better-auth/adapters/mongodb';
import {nextCookies} from 'better-auth/next-js';

async function getDatabase() {
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

export async function getAuth() {
  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || 'development-secret',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: mongodbAdapter(await getDatabase()),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7
    },
    plugins: [nextCookies()]
  });
}
