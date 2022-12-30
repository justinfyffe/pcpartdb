import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('slug').notNullable();

    table.string('type').notNullable();
    table.string('name').notNullable();

    table.jsonb('specs');
    table.jsonb('metas');
    table.jsonb('benchmarks');
    table.jsonb('images');

    table.timestamps(true, true);

    table.unique(['slug']);
    table.unique(['type', 'name']);
  });

  await knex.raw(`
    CREATE TRIGGER update_products_updated_at BEFORE UPDATE
    ON products FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}
