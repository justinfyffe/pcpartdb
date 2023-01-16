import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('parts', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('slug').notNullable();

    table.string('type').notNullable();
    table.string('name').notNullable();

    table.jsonb('metas');
    table.jsonb('specs');
    table.jsonb('benchmarks');

    table.timestamps(true, true);

    table.unique(['slug']);
    table.unique(['type', 'name']);
  });

  await knex.raw(`
    CREATE TRIGGER update_parts_updated_at BEFORE UPDATE
    ON parts FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('parts');
}
