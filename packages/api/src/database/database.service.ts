import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Context } from '../shared/context';

interface TransactionOptions {
  ctx?: Context;
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async transaction<T = void>(
    callback: (trx: Prisma.TransactionClient) => Promise<T>,
    options?: TransactionOptions,
  ) {
    return await this.$transaction(
      async (trx) => {
        if (options?.ctx != null) {
          options.ctx.trx = trx;
        }

        return await callback(trx);
      },
      { isolationLevel: options?.isolationLevel },
    );
  }
}
