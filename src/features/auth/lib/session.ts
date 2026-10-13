import {headers} from 'next/headers';

import {getAuth} from '@/features/auth/lib/auth';

export async function getSession() {
  const auth = await getAuth();
  const requestHeaders = await headers();

  return auth.api.getSession({
    headers: requestHeaders
  });
}
