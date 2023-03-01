import { Prisma, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const POSTGRES_HOST = process.env.POSTGRES_HOST ?? '';
const POSTGRES_PORT =
  process.env.POSTGRES_PORT != null
    ? Number(process.env.DB_POPOSTGRES_PORTRT)
    : -1;
const POSTGRES_DB = process.env.POSTGRES_DB ?? '';
const POSTGRES_USER = process.env.POSTGRES_USER ?? '';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? '';

if (POSTGRES_HOST === '') {
  throw new Error('Missing POSTGRES_HOST. Please add it to .env');
}

if (POSTGRES_PORT === -1) {
  throw new Error('Missing POSTGRES_PORT. Please add it to .env');
}

if (POSTGRES_DB === '') {
  throw new Error('Missing POSTGRES_DB. Please add it to .env');
}

if (POSTGRES_USER === '') {
  throw new Error('Missing POSTGRES_USER. Please add it to .env');
}

if (POSTGRES_PASSWORD === '') {
  throw new Error('Missing POSTGRES_PASSWORD. Please add it to .env');
}

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
