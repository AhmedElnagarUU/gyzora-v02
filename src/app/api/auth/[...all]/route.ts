import {toNextJsHandler} from 'better-auth/next-js';

import {getAuth} from '@/features/auth/lib/auth';

const getHandler = async () => toNextJsHandler(await getAuth());

export async function GET(request: Request) {
  return (await getHandler()).GET(request);
}

export async function POST(request: Request) {
  return (await getHandler()).POST(request);
}
