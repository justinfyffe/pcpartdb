import { transaction } from '@server/db/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'objection';

export interface ServiceContext {
  trx?: Transaction;
  api?: {
    req?: NextApiRequest;
    res?: NextApiResponse;
  };
}

export function withServiceContext(
  controller: (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: ServiceContext,
  ) => unknown,
) {
  const func = async (req: NextApiRequest, res: NextApiResponse) => {
    await transaction(async (trx) => {
      await controller(req, res, { trx, api: { req, res } });
    });
  };

  return func;
}
