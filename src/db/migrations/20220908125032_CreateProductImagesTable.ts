import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'product_images',
    (table: Knex.TableBuilder) => {
      table.integer('product_id').notNullable();
      table.integer('image_id').notNullable();
      table.string('type').notNullable();

      table.timestamps(true, true);

      table.primary(['product_id', 'image_id']);

      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade');

      table
        .foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('cascade');
    },
  );

  await knex.raw(`
    CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE
    ON product_images FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_images');
}
