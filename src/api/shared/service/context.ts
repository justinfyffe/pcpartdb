import express from 'express';
import { Transaction } from 'objection';

export interface ServiceContext {
  trx?: Transaction;
  request?: express.Request;
  response?: express.Response;
}
