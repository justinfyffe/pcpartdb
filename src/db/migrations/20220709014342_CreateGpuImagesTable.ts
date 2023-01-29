import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('gpu_images', (table: Knex.TableBuilder) => {
    table.integer('gpu_id').unsigned();
    table.integer('image_id').unsigned();

    table.timestamps(true, true);

    table.primary(['gpu_id', 'image_id']);

    table
      .foreign('gpu_id')
      .references('id')
      .inTable('gpus')
      .onDelete('cascade');

    table
      .foreign('image_id')
      .references('id')
      .inTable('images')
      .onDelete('cascade');
  });

  await knex.raw(`
    CREATE TRIGGER update_gpu_images_updated_at BEFORE UPDATE
    ON gpu_images FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('gpu_images');
}
