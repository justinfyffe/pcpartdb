/*
  Warnings:

  - A unique constraint covering the columns `[product_type,source_key,group_key]` on the table `product_sources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_key` to the `product_sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_sources" ADD COLUMN     "group_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_sources_product_type_source_key_group_key_key" ON "product_sources"("product_type", "source_key", "group_key");

-- RenameIndex
ALTER INDEX "product_sources_type_name_index" RENAME TO "product_sources_productType_sourceName_index";

-- RenameIndex
ALTER INDEX "product_updates_created_at_index" RENAME TO "product_updates_createdAt_index";

-- RenameIndex
ALTER INDEX "product_updates_type_cpuId" RENAME TO "product_updates_productType_cpuId_index";

-- RenameIndex
ALTER INDEX "product_updates_type_gpuId" RENAME TO "product_updates_productType_gpuId_index";

-- RenameIndex
ALTER INDEX "product_updates_type_status_index" RENAME TO "product_updates_productType_gpuProductType_status_index";
