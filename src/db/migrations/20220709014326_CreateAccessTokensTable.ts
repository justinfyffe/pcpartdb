import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('user_id').notNullable();

    table.string('token_hash').notNullable();
    table.timestamp('date_expired', { useTz: true });

    table.timestamps(true, true);

    table.unique(['token_hash']);

    table.index('date_expired');

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade');
  });

  await knex.raw(`
    CREATE TRIGGER update_access_tokens_updated_at BEFORE UPDATE
    ON access_tokens FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('access_tokens');
}
