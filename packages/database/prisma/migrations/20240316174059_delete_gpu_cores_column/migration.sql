/*
  Warnings:

  - You are about to drop the column `gpu_cores_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `gpu_cores_value` on the `gpu_fields` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gpu_fields" DROP COLUMN "gpu_cores_meta",
DROP COLUMN "gpu_cores_value";
