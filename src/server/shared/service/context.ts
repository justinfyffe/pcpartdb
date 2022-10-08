import type { Request, Response } from 'express';
import { Transaction } from 'objection';

export interface ServiceContext {
  trx?: Transaction;
  request?: Request;
  response?: Response;
}
