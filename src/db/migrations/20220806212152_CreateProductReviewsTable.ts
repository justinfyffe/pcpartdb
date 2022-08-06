import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'product_reviews',
    (table: Knex.TableBuilder) => {
      table.increments('id');
      table.integer('product_id').notNullable();

      table.string('source');
      table.string('key').notNullable();
      table.jsonb('value');

      table.timestamps(true, true);

      table.unique(['product_id', 'key']);

      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade');
    },
  );

  await knex.raw(`
    CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE
    ON product_reviews FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_reviews');
}
