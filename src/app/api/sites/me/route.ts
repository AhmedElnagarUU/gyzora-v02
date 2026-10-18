import {NextResponse} from 'next/server';

import {
  deleteSiteForOwner,
  getSiteForOwner,
  toSiteView,
  updateSiteForOwner,
} from '@/features/sites/service';
import {updateSiteSchema} from '@/features/sites/schemas/update-site-schema';
import {ok} from '@/shared/http/api-response';
import {AppError} from '@/shared/http/app-error';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

export const GET = withSession(async ({session}) => {
  const site = await getSiteForOwner(session.user.id);

  if (!site) {
    throw new AppError('NOT_FOUND', 404);
  }

  return ok({site: toSiteView(site)});
});

export const PATCH = withSession(async ({session, req}) => {
  const body = await req.json().catch(() => null);
  const {revision, data} = updateSiteSchema.parse(body);
  const site = await updateSiteForOwner(session.user.id, revision, data);

  return ok({site});
});

export const DELETE = withSession(async ({session}) => {
  await deleteSiteForOwner(session.user.id);

  return new NextResponse(null, {status: 204});
});
