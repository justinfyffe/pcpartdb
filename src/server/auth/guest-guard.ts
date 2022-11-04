import { ApiContext } from '@server/shared/api/context';
import { unauthorizedError } from '@server/shared/api/status';
import { SsrContext } from '@server/shared/ssr/context';

export function guestGuard(ctx: ApiContext | SsrContext) {
  if (ctx.user != null) {
    throw unauthorizedError();
  }
}
