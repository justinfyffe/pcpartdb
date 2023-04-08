import { Prisma, PrismaClient } from '@prisma/client';

export type IsolationLevel = Prisma.TransactionIsolationLevel;
export type Transaction = Prisma.TransactionClient;

interface TransactionOptions {
  isolationLevel?: IsolationLevel;
}

export class DatabaseClient extends PrismaClient {
  async connect() {
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
      { isolationLevel: options?.isolationLevel },
    );
  }
}
