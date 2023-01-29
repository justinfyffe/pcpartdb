import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('gpus', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('parent_id').unsigned();
    table.string('slug').notNullable();

    table.string('name').notNullable();

    table.string('affiliate_url');

    table.timestamps(true, true);

    table.unique(['slug']);
    table.unique(['name']);

    table
      .foreign('parent_id')
      .references('id')
      .inTable('gpus')
      .onDelete('cascade');
  });

  await knex.raw(`
    CREATE TRIGGER update_gpus_updated_at BEFORE UPDATE
    ON gpus FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('gpus');
}
