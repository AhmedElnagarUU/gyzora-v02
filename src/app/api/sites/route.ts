import {createSiteForOwner} from '@/features/sites/create-site';
import {createSiteSchema} from '@/features/sites/schemas/create-site-schema';
import {ok} from '@/shared/http/api-response';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

export const POST = withSession(async ({session, req}) => {
  const body = await req.json().catch(() => null);
  const values = createSiteSchema.parse(body);
  const {siteId} = await createSiteForOwner(session.user.id, values);

  return ok({siteId, status: 'draft'}, 201);
});
