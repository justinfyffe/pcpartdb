import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'gpu_benchmarks',
    (table: Knex.TableBuilder) => {
      table.integer('gpu_id').unsigned();

      table.jsonb('performance_score');
      table.jsonb('value_score');
      table.jsonb('g3d_mark');
      table.jsonb('g2d_mark');
      table.jsonb('timespy_graphics');

      table.timestamps(true, true);

      table.primary(['gpu_id']);

      table
        .foreign('gpu_id')
        .references('id')
        .inTable('gpus')
        .onDelete('cascade');
    },
  );

  await knex.raw(`
    CREATE TRIGGER update_gpu_benchmarks_updated_at BEFORE UPDATE
    ON gpu_benchmarks FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('gpu_benchmarks');
}
