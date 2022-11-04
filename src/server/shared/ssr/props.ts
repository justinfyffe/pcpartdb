import { guestGuard } from '@server/auth/guest-guard';
import { staffGuard } from '@server/auth/staff-guard';
import { userGuard } from '@server/auth/user-guard';
import { transaction } from '@server/db/database';
import { userMiddleware } from '@server/user/user-middleware';
import { NextPageContext } from 'next';
import { SsrContext } from './context';
import { errorHandler } from './error';

type GuardFunction = (ctx: SsrContext) => void;

interface SsrPageProps {
  props?: unknown;
  redirect?: unknown;
}

export function ssrPageProps(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (ctx: SsrContext) => unknown,
  guards?: GuardFunction[],
) {
  const newFunc = async (pageCtx: NextPageContext): Promise<SsrPageProps> => {
    const ctx: SsrContext = {
      req: pageCtx.req,
      res: pageCtx.res,
      page: pageCtx,
    };
    try {
      return await transaction(async (trx) => {
        ctx.trx = trx;

        // Middleware
        await userMiddleware(ctx);

        // Apply Guards
        for (const guard of guards ?? []) {
          await guard(ctx);
        }

        // Run getServerSideProps
        const props = (await func(ctx)) ?? {};
        return { props: JSON.parse(JSON.stringify(props)) };
      });
    } catch (e) {
      console.log(e);
      return errorHandler(e as Error);
    }
  };

  return newFunc;
}

export function staffSsrPageProps(func: (ctx: SsrContext) => unknown) {
  return ssrPageProps(func, [staffGuard]);
}

export function userSsrPageProps(func: (ctx: SsrContext) => unknown) {
  return ssrPageProps(func, [userGuard]);
}

export function guestSsrPageProps(func: (ctx: SsrContext) => unknown) {
  return ssrPageProps(func, [guestGuard]);
}
