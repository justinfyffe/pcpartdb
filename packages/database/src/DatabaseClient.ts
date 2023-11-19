import { Prisma, PrismaClient } from '@prisma/client';

export type IsolationLevel = Prisma.TransactionIsolationLevel;
export type Transaction = Prisma.TransactionClient;

const DEFAULT_MAX_WAIT = 5_000;
const DEFAULT_TIMEOUT = 10_000;

interface TransactionOptions {
  isolationLevel?: IsolationLevel;
  timeout?: number;
  maxWait?: number;
}

export class DatabaseClient extends PrismaClient {
  constructor() {
    super({
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async connect() {
    console.log('connect to db');
    await this.$connect();
  }

  async transaction<T = void>(
    callback: (trx: Transaction) => Promise<T>,
    options?: TransactionOptions,
  ) {
    return await this.$transaction(
      async (trx) => {
        return await callback(trx);
      },
      {
        isolationLevel: options?.isolationLevel,
        timeout: options?.timeout || DEFAULT_TIMEOUT,
        maxWait: options?.maxWait || DEFAULT_MAX_WAIT,
      },
    );
  }
}
