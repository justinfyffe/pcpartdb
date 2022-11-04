import { UserModel } from '@server/user/user-model';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'objection';

export interface ApiContext {
  trx?: Transaction;
  req?: NextApiRequest;
  res?: NextApiResponse;
  user?: UserModel;
  token?: string;
}
