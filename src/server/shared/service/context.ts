import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'objection';

export interface ServiceContext {
  trx?: Transaction;
  api?: {
    req?: NextApiRequest;
    res?: NextApiResponse;
  };
}
