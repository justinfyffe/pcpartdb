import { guestGuard } from '@pcpartdb/website/server/auth/guest-guard';
import { staffGuard } from '@pcpartdb/website/server/auth/staff-guard';
import { userGuard } from '@pcpartdb/website/server/auth/user-guard';
import { transaction } from '@pcpartdb/website/server/db/database';
import { userMiddleware } from '@pcpartdb/website/server/user/user-middleware';
import { NextPageContext } from 'next';
import { contextPropsMiddleware } from '../context/context-props-middleware';
import { SsrContext } from './context';
import { errorHandler } from './error';

type GuardFunction = (ctx: SsrContext) => void;

interface SsrPageProps {
  props?: unknown;
  redirect?: unknown;
}

export function ssrPageProps<T = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (ctx: SsrContext) => T | Promise<T>,
  guards?: GuardFunction[],
) {
  const newFunc = async (pageCtx: NextPageContext): Promise<SsrPageProps> => {
    const ctx: SsrContext = {
      req: pageCtx.req,
      res: pageCtx.res,
      page: pageCtx,
      props: {},
    };
    try {
      return await transaction(async (trx) => {
        ctx.trx = trx;

        // Middleware
        await userMiddleware(ctx);
        await contextPropsMiddleware(ctx);

        // Apply Guards
        for (const guard of guards ?? []) {
          await guard(ctx);
        }

        // Run getServerSideProps
        const props = (await func(ctx)) ?? {};
        return JSON.parse(
          JSON.stringify({ props: { ...props, ctx: ctx.props } }),
        );
      });
    } catch (e) {
      console.log(e);
      const error = errorHandler(e as Error);
      return JSON.parse(JSON.stringify({ props: { error, ctx: ctx.props } }));
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
