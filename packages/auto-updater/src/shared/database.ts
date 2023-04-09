import { DatabaseClient } from '@pcpartdb/database';

let database: DatabaseClient;
export async function getDatabase() {
  if (database != null) {
    return database;
  }

  database = new DatabaseClient();
  await database.connect();
  return database;
}
