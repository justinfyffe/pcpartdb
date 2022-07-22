import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('images', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('path').notNullable();

    table.string('name').notNullable();
    table.string('source_name');
    table.string('source_url');

    table.integer('file_size');
    table.integer('height');
    table.integer('width');

    table.timestamp('uploaded_at', { useTz: true }).defaultTo(knex.fn.now());

    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_images_updated_at BEFORE UPDATE
    ON images FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('images');
}
