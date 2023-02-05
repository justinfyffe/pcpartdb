import { Prisma } from '@prisma/client';
import { User } from '@shared/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { ContextProps } from '../context';

export interface ApiContext {
  trx?: Prisma.TransactionClient;
  req?: NextApiRequest;
  res?: NextApiResponse;
  user?: User;
  token?: string;
  props?: ContextProps;
}
