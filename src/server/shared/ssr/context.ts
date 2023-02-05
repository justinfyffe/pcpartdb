import { Prisma } from '@prisma/client';
import { User } from '@shared/user';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPageContext } from 'next';
import { ContextProps } from '../context';

export interface SsrContext {
  trx?: Prisma.TransactionClient;
  req?: IncomingMessage;
  res?: ServerResponse;
  user?: User;
  token?: string;
  page?: NextPageContext;
  props?: ContextProps;
}
