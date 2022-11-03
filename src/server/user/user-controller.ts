import { withStaffGuard } from '@server/auth/staff-guard';
import { withErrorFilter } from '@server/shared/errors/error-filter';
import {
  ServiceContext,
  withServiceContext,
} from '@server/shared/service/context';
import { serializeAsync } from '@server/shared/types/serialize';
import type {
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
} from '@shared/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { userService } from './user-service';

export const listUsers = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const users = await serializeAsync(userService.list(ctx));
        res.status(200).json(users);
      },
    ),
  ),
);

export const getUser = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const id = Number(req.query['id'] as string);

        const user = await serializeAsync(userService.get(id, ctx));

        res.status(200).json(user);
      },
    ),
  ),
);

export const createUser = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const body: UserRequest = req.body;

        const user = await serializeAsync(userService.create(body, ctx));

        res.status(200).json(user);
      },
    ),
  ),
);

export const updateUser = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const id = Number(req.query['id'] as string);
        const body = req.body as UserRequest;

        const user = await serializeAsync(userService.update(id, body, ctx));

        res.status(200).json(user);
      },
    ),
  ),
);

export const registerUser = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const body = req.body as RegisterRequest;

        const user = await serializeAsync(
          userService.create({ ...body, isStaff: false }, ctx),
        );

        res.status(200).json(user);
      },
    ),
  ),
);

export const requestPasswordReset = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const body = req.body as RequestPasswordResetRequest;

        await userService.requestPasswordReset(body, ctx);
        res.status(204).send({});
      },
    ),
  ),
);

export const resetPassword = withErrorFilter(
  withStaffGuard(
    withServiceContext(
      async (
        req: NextApiRequest,
        res: NextApiResponse,
        ctx: ServiceContext,
      ) => {
        const body = req.body as ResetPasswordRequest;
        await userService.resetPassword(body, ctx);
        res.status(204).send({});
      },
    ),
  ),
);
