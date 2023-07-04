import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
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
}

@Injectable()
export class Database extends DatabaseClient implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async transaction<T = void>(
    callback: (trx: Transaction) => Promise<T>,
    options?: TransactionOptions,
  ) {
    return await super.transaction(
      async (trx) => {
        if (options?.ctx != null) {
          options.ctx.trx = trx;
        }

        return await callback(trx);
      },
      { isolationLevel: options?.isolationLevel, timeout: options?.timeout },
    );
  }
}
