import {z} from 'zod';

import {presignUpload} from '@/features/images/presign-service';
import {findSiteByOwnerId} from '@/features/sites/repository';
import {ok} from '@/shared/http/api-response';
import {AppError} from '@/shared/http/app-error';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

const presignSchema = z
  .object({
    kind: z.enum(['logo', 'cover', 'gallery', 'receipt']),
    contentType: z.string().min(1),
    size: z.number().int().positive(),
  })
  .strict();

export const POST = withSession(async ({session, req}) => {
  const body = await req.json().catch(() => null);
  const values = presignSchema.parse(body);

  const site = await findSiteByOwnerId(session.user.id);

  if (!site) {
    throw new AppError('NO_SITE', 409);
  }

  if (values.kind === 'receipt') {
    throw new AppError('UPLOAD_REJECTED', 400, {kind: 'invalid_format'});
  }

  const upload = await presignUpload({
    siteId: site._id.toString(),
    kind: values.kind,
    contentType: values.contentType,
    size: values.size,
  });

  return ok(upload);
});
