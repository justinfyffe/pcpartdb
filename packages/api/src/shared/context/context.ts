import { Config, Semaphore, User } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  trx?: Prisma.TransactionClient;
  req?: Request;
  res?: Response;
  user?: User;
  token?: string;
  config?: Config;
  uuid?: string;
  queryLock?: Semaphore; // Unused
  queryCounter: (increment?: boolean) => number;
}
