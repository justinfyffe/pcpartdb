-- AlterTable
ALTER TABLE "gpu_fields" ADD COLUMN     "cuda_cores_meta" JSONB,
ADD COLUMN     "cuda_cores_value" DOUBLE PRECISION,
ADD COLUMN     "execution_units_meta" JSONB,
ADD COLUMN     "execution_units_value" DOUBLE PRECISION,
ADD COLUMN     "shading_units_meta" JSONB,
ADD COLUMN     "shading_units_value" DOUBLE PRECISION,
ADD COLUMN     "stream_multiprocessors_meta" JSONB,
ADD COLUMN     "stream_multiprocessors_value" DOUBLE PRECISION,
ADD COLUMN     "stream_processors_meta" JSONB,
ADD COLUMN     "stream_processors_value" DOUBLE PRECISION;
