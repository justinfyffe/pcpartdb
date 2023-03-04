import { Prisma } from '@prisma/client';

export interface RepositoryConfig {
  trx?: Prisma.TransactionClient;
}
