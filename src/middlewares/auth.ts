import { createMiddleware } from 'hono/factory';
import { auth } from '@/lib/auth';
import { AppBindings } from '@/lib/types';

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});
