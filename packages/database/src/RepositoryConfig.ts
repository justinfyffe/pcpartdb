import { Semaphore } from '@pcpartdb/shared';
import { Transaction } from './DatabaseClient';

export interface RepositoryConfig {
  trx?: Transaction;
  queryCounter: (increment?: boolean) => number;
  queryLock?: Semaphore; // UNUSED
}
