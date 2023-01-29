import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('gpu_specs', (table: Knex.TableBuilder) => {
    table.integer('gpu_id').unsigned().notNullable();

    // TODO: move these for to gpus?
    table.jsonb('company');
    table.jsonb('market_segment');
    table.jsonb('launch_price');
    table.jsonb('release_date');

    table.jsonb('gpu_codename');
    table.jsonb('architecture');
    table.jsonb('process_size');
    table.jsonb('transistors');

    table.jsonb('memory_size');
    table.jsonb('memory_type');
    table.jsonb('memory_clock');
    table.jsonb('memory_interface');
    table.jsonb('memory_bandwidth');

    table.jsonb('slot_width');
    table.jsonb('length');
    table.jsonb('width');
    table.jsonb('height');
    table.jsonb('weight');
    table.jsonb('thermal_design_power');
    table.jsonb('suggested_psu');
    table.jsonb('bus_interface');
    table.jsonb('power_connectors');
    table.jsonb('outputs');

    table.jsonb('shader_units_cuda_cores');
    table.jsonb('texture_mapping_units');
    table.jsonb('render_output_units');
    table.jsonb('tensor_cores');
    table.jsonb('ray_tracing_cores');
    table.jsonb('core_clock_speed_base');
    table.jsonb('core_clock_speed_boost');
    table.jsonb('l1_cache');
    table.jsonb('l2_cache');

    table.jsonb('pixel_fill_rate');
    table.jsonb('texture_fill_rate');
    table.jsonb('fp32_performance');
    table.jsonb('fp64_performance');

    table.jsonb('directx_version');
    table.jsonb('open_cl_version');
    table.jsonb('open_gl_version');
    table.jsonb('shader_model_version');

    table.timestamps(true, true);

    table.primary(['gpu_id']);

    table
      .foreign('gpu_id')
      .references('id')
      .inTable('gpus')
      .onDelete('cascade');
  });

  await knex.raw(`
    CREATE TRIGGER update_gpu_specs_updated_at BEFORE UPDATE
    ON gpu_specs FOR EACH ROW EXECUTE PROCEDURE 
    on_update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('gpu_specs');
}
