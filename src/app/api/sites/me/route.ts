import {getSiteForOwner, toSiteView} from '@/features/sites/service';
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
