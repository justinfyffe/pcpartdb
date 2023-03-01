import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import { unauthorizedError } from '@pcpartdb/website/server/shared/api/status';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';

export function staffGuard(ctx: ApiContext | SsrContext) {
  if (ctx.user?.isStaff !== true) {
    throw unauthorizedError();
  }
}
