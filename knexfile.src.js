// Update with your config settings.
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `${__dirname}/.env` });

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './packages/data/src/db/migrations',
    tableName: 'knex_migrations',
  },
};
