import {betterAuth} from 'better-auth';
import {mongodbAdapter} from 'better-auth/adapters/mongodb';

import {getDatabase} from '@/shared/db/mongodb';
import {getAuthEnv} from '@/shared/config/env';

let authPromise: ReturnType<typeof createAuth> | undefined;

async function createAuth() {
  const {BETTER_AUTH_SECRET: secret, BETTER_AUTH_URL: baseURL} = getAuthEnv();

  return betterAuth({
    secret,
    baseURL,
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
