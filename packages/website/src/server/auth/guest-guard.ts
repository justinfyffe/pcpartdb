import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import { unauthorizedError } from '@pcpartdb/website/server/shared/api/status';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';

export function guestGuard(ctx: ApiContext | SsrContext) {
  if (ctx.user != null) {
    throw unauthorizedError();
  }
}
