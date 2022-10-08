import { Transaction } from 'objection';

export interface RepositoryConfig {
  trx?: Transaction;
}
