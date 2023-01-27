import { UserModel } from '@server/user/user-model';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'objection';
import { ContextProps } from '../context';

export interface ApiContext {
  trx?: Transaction;
  req?: NextApiRequest;
  res?: NextApiResponse;
  user?: UserModel;
  token?: string;
  props?: ContextProps;
}
