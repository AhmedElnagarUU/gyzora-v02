import {NextResponse} from 'next/server';

import {
  deleteProjectForOwner,
  getProjectForOwner,
  updateProjectForOwner,
} from '@/features/projects/service';
import {projectSchema} from '@/features/projects/schemas/project-schema';
import {ok} from '@/shared/http/api-response';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

type RouteContext = {params: Promise<{id: string}>};

export const GET = withSession<RouteContext>(async ({session, routeContext}) => {
  const {id} = await routeContext.params;
  const project = await getProjectForOwner(session.user.id, id);

  return ok({project});
});

export const PATCH = withSession<RouteContext>(async ({session, req, routeContext}) => {
  const {id} = await routeContext.params;
  const body = await req.json().catch(() => null);
  const values = projectSchema.parse(body);
  const project = await updateProjectForOwner(session.user.id, id, values);

  return ok({project});
});

export const DELETE = withSession<RouteContext>(async ({session, routeContext}) => {
  const {id} = await routeContext.params;
  await deleteProjectForOwner(session.user.id, id);

  return new NextResponse(null, {status: 204});
});
