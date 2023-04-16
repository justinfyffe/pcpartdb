/*
  Warnings:

  - You are about to drop the `gpu_benchmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gpu_specs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gpu_benchmarks" DROP CONSTRAINT "gpu_benchmarks_gpu_id_foreign";

-- DropForeignKey
ALTER TABLE "gpu_specs" DROP CONSTRAINT "gpu_specs_gpu_id_foreign";

-- DropTable
DROP TABLE "gpu_benchmarks";

-- DropTable
DROP TABLE "gpu_specs";
