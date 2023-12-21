/*
  Warnings:

  - You are about to drop the column `performance_per_msrp_meta` on the `cpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_per_msrp_value` on the `cpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_rating_meta` on the `cpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_rating_value` on the `cpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_per_msrp_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_per_msrp_value` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_rating_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `performance_rating_value` on the `gpu_fields` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cpu_fields" DROP COLUMN "performance_per_msrp_meta",
DROP COLUMN "performance_per_msrp_value",
DROP COLUMN "performance_rating_meta",
DROP COLUMN "performance_rating_value";

-- AlterTable
ALTER TABLE "gpu_fields" DROP COLUMN "performance_per_msrp_meta",
DROP COLUMN "performance_per_msrp_value",
DROP COLUMN "performance_rating_meta",
DROP COLUMN "performance_rating_value";
