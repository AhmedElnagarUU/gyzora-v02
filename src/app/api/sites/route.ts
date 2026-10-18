import {createSiteForOwner} from '@/features/sites/service';
import {createSiteSchema} from '@/features/sites/schemas/create-site-schema';
import {ok} from '@/shared/http/api-response';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

export const POST = withSession(async ({session, req}) => {
  const body = await req.json().catch(() => null);
  const values = createSiteSchema.parse(body);
  const {siteId, slug} = await createSiteForOwner(session.user.id, values);

  return ok(
    {site: {id: siteId, slug, status: 'draft', templateId: values.templateId}},
    201
  );
});
