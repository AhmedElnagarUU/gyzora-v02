import {createProjectForOwner, listProjectsForOwner} from '@/features/projects/service';
import {projectSchema} from '@/features/projects/schemas/project-schema';
import {ok} from '@/shared/http/api-response';
import {withSession} from '@/shared/http/with-session';

export const dynamic = 'force-dynamic';

export const GET = withSession(async ({session}) => {
  const projects = await listProjectsForOwner(session.user.id);

  return ok({projects});
});

export const POST = withSession(async ({session, req}) => {
  const body = await req.json().catch(() => null);
  const values = projectSchema.parse(body);
  const project = await createProjectForOwner(session.user.id, values);

  return ok({project}, 201);
});
