import {getSession} from '@/features/auth/lib/session';

import {fail} from './api-response';
import {AppError} from './app-error';

export type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export type SessionContext = {
  session: Session;
  req: Request;
};

export function withSession(handler: (context: SessionContext) => Promise<Response> | Response) {
  return async (req: Request): Promise<Response> => {
    try {
      const session = await getSession();

      if (!session) {
        throw new AppError('UNAUTHENTICATED', 401);
      }

      return await handler({session, req});
    } catch (error) {
      return fail(error);
    }
  };
}
