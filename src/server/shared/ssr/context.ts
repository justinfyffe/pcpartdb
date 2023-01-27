import { UserModel } from '@server/user/user-model';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPageContext } from 'next';
import { Transaction } from 'objection';
import { ContextProps } from '../context';

export interface SsrContext {
  trx?: Transaction;
  req?: IncomingMessage;
  res?: ServerResponse;
  user?: UserModel;
  token?: string;
  page?: NextPageContext;
  props?: ContextProps;
}
