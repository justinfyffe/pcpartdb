import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'product_benchmarks',
    (table: Knex.TableBuilder) => {
      table.increments('id');
      table.integer('product_id').notNullable();

      table.string('key').notNullable();

      table.integer('integer_value');
      table.float('float_value');
      table.boolean('boolean_value');
      table.string('string_value');
      table.text('text_value');
      table.jsonb('json_value');

      table.jsonb('metadata');
      table.string('source');

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
    CREATE TRIGGER update_product_benchmarks_updated_at BEFORE UPDATE
    ON product_benchmarks FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_benchmarks');
}
