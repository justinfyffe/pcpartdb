/*
  Warnings:

  - You are about to drop the column `gpu_chipset_id` on the `automation_sources` table. All the data in the column will be lost.

*/
-- Delete data associated with column
DELETE FROM "automation_sources" WHERE "gpu_chipset_id" IS NOT NULL;

-- Update sources with videocard_benchmarks
UPDATE "automation_sources" SET "source_key" = 'PASSMARK' WHERE "source_key" = 'VIDEOCARD_BENCHMARKS';

-- Delete pending updates
DELETE FROM "product_updates";

-- DropForeignKey
ALTER TABLE "automation_sources" DROP CONSTRAINT "automationSources_gpuChipset_foreign";

-- DropIndex
DROP INDEX "automationSources_productType_archived_gpuChipsetId_index";

-- AlterTable
ALTER TABLE "automation_sources" DROP COLUMN "gpu_chipset_id";
