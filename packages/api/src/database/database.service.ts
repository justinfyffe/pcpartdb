import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DatabaseClient,
  IsolationLevel,
  Transaction,
} from '@pcpartdb/database';
import { Context } from '../shared/context';

interface TransactionOptions {
  ctx?: Context;
  isolationLevel?: IsolationLevel;
  timeout?: number;
  maxWait?: number;
}

@Injectable()
export class Database extends DatabaseClient implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
  }

  async transaction<T = void>(
    callback: (trx: Transaction) => Promise<T>,
    options?: TransactionOptions,
  ) {
    if (options?.ctx?.trx != null) {
      return await callback(options.ctx.trx);
    }

    return await super.transaction(
      async (trx) => {
        if (options?.ctx != null) {
          options.ctx.trx = trx;
        }

        const result = await callback(trx);

        if (options?.ctx?.trx != null) {
          options.ctx.trx = null;
        }

        return result;
      },
      {
        isolationLevel: options?.isolationLevel,
        maxWait: options?.maxWait,
        timeout: options?.timeout,
      },
    );
  }
}
