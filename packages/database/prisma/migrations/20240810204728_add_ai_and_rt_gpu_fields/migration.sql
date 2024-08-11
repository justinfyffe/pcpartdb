-- AlterTable
ALTER TABLE "gpu_fields" ADD COLUMN     "ai_accelerators_meta" JSONB,
ADD COLUMN     "ai_accelerators_value" DOUBLE PRECISION,
ADD COLUMN     "gpu_core_game_clock_meta" JSONB,
ADD COLUMN     "gpu_core_game_clock_value" DOUBLE PRECISION,
ADD COLUMN     "ray_accelerators_meta" JSONB,
ADD COLUMN     "ray_accelerators_value" DOUBLE PRECISION;
