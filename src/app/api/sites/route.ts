import {NextResponse} from 'next/server';

import {getSession} from '@/features/auth/lib/session';
import {createSiteForOwner} from '@/features/sites/create-site';
import {createSiteSchema} from '@/features/sites/schemas/create-site-schema';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const json = await request.json().catch(() => null);

  if (!json) {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  const parsed = createSiteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({error: 'Validation failed'}, {status: 400});
  }

  const result = await createSiteForOwner(session.user.id, parsed.data);
  if (result.kind === 'already-exists') {
    return NextResponse.json({error: 'Site already exists for this account'}, {status: 409});
  }

  return NextResponse.json({siteId: result.siteId, status: 'draft'}, {status: 201});
}
