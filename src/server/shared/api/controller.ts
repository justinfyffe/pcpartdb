import { guestGuard } from '@server/auth/guest-guard';
import { staffGuard } from '@server/auth/staff-guard';
import { userGuard } from '@server/auth/user-guard';
import { transaction } from '@server/db/database';
import { userMiddleware } from '@server/user/user-middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from '../types/serialize';
import { ApiContext } from './context';
import { errorHandler } from './error';
import { ok } from './status';

type GuardFunction = (ctx: ApiContext) => void;

export function controller(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (ctx: ApiContext) => any,
  guards?: GuardFunction[],
) {
  const newFunc = async (req: NextApiRequest, res: NextApiResponse) => {
    const ctx: ApiContext = { req, res };
    try {
      await transaction(async (trx) => {
        ctx.trx = trx;

        // Middleware
        await userMiddleware(ctx);

        // Apply Guards
        for (const guard of guards ?? []) {
          await guard(ctx);
        }

        // Run Controller
        let result = await func(ctx);
        result = serialize(result);

        // Send back resposne
        ok(result ?? {}, ctx);
      });
    } catch (e) {
      console.log(e);
      errorHandler(ctx, e as Error);
    }
  };

  return newFunc;
}

export function staffController(func: (ctx: ApiContext) => unknown) {
  return controller(func, [staffGuard]);
}

export function userController(func: (ctx: ApiContext) => unknown) {
  return controller(func, [userGuard]);
}

export function guestController(func: (ctx: ApiContext) => unknown) {
  return controller(func, [guestGuard]);
}
