import { Prisma, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();

export async function transaction<T = void>(
  callback: (trx: Prisma.TransactionClient) => Promise<T>,
  isolationLevel?: Prisma.TransactionIsolationLevel,
) {
  return await prisma.$transaction(
    async (trx) => {
      return await callback(trx);
    },
    { isolationLevel },
  );
}
