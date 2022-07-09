import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('email').notNullable();

    table.string('password_hash').notNullable();
    table.boolean('is_staff').defaultTo(false);
    table
      .timestamp('date_registered', { useTz: true })
      .defaultTo(knex.fn.now());

    table.timestamps(true, true);

    table.unique(['email']);
  });

  await knex.raw(`
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
