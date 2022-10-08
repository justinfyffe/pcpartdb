import * as dotenv from 'dotenv';
import initKnex, { Knex } from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';

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

export enum IsolationLevel {
  ReadUncommitted = 'read uncommitted',
  ReadCommitted = 'read committed',
  Snapshot = 'snapshot',
  RepeatableRead = 'repeatable read',
  Serializable = 'serializable',
}

let db: Knex | undefined;
export async function closeDatabase() {
  if (db == null) {
    return;
  }

  await db.destroy();
  db = undefined;
}

export function openDatabase() {
  if (db != null) {
    return db;
  }

  if (process.env.NODE_ENV === 'development' && (global as any).db != null) {
    // Prevent hotloading from causing too many clients error.
    db = (global as any).db;
  } else {
    const host = POSTGRES_HOST;
    const port = POSTGRES_PORT;
    const database = POSTGRES_DB;
    const user = POSTGRES_USER;
    const password = POSTGRES_PASSWORD;

    db = initKnex({
      client: 'pg',
      useNullAsDefault: true,
      connection: { host, port, user, password, database },
      ...knexSnakeCaseMappers(),
    });
    (global as any).db = db;
  }

  Model.knex(db);
  return db;
}

export function transaction<T>(
  callback: (t: Knex.Transaction) => Promise<T>,
  isolationLevel?: IsolationLevel,
) {
  const db = openDatabase();

  return db.transaction(callback, { isolationLevel });
}
