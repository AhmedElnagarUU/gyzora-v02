import {betterAuth} from 'better-auth';
import {mongodbAdapter} from 'better-auth/adapters/mongodb';

import {getDatabase} from '@/shared/db/mongodb';

let authPromise: ReturnType<typeof createAuth> | undefined;

async function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is not configured.');
  }

  return betterAuth({
    secret,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: mongodbAdapter(await getDatabase()),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7
    }
  });
}

export function getAuth() {
  if (!authPromise) {
    authPromise = createAuth().catch((error: unknown) => {
      authPromise = undefined;
      throw error;
    });
  }

  return authPromise;
}
