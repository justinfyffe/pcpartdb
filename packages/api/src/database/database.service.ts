import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

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
    isolationLevel?: Prisma.TransactionIsolationLevel,
  ) {
    return await this.$transaction(
      async (trx) => {
        return await callback(trx);
      },
      { isolationLevel },
    );
  }
}
