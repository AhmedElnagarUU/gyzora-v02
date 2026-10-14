import {betterAuth} from 'better-auth';
import {mongodbAdapter} from 'better-auth/adapters/mongodb';
import {nextCookies} from 'better-auth/next-js';

import {getDatabase} from '@/shared/db/mongodb';

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
