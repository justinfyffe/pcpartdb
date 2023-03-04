import { Prisma } from '@pcpartdb/database';
import { User } from '@pcpartdb/shared';
import { Request, Response } from 'express';

export interface ContextProps {
  enableGoogleAnalytics?: boolean;
  googleAnalyticsId?: string;
  isStaff?: boolean;
}

export interface Context {
  trx?: Prisma.TransactionClient;
  req?: Request;
  res?: Response;
  user?: User;
  token?: string;
  props?: ContextProps;
}
