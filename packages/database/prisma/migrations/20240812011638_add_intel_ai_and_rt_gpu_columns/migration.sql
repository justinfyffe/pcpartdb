-- AlterTable
ALTER TABLE "gpu_fields" ADD COLUMN     "ray_tracing_units_meta" JSONB,
ADD COLUMN     "ray_tracing_units_value" DOUBLE PRECISION,
ADD COLUMN     "xe_matrix_extensions_meta" JSONB,
ADD COLUMN     "xe_matrix_extensions_value" DOUBLE PRECISION;
