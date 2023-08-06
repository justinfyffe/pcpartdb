/*
  Warnings:

  - You are about to drop the column `product_company` on the `product_updates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_type,source_key,external_key]` on the table `product_sources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_key` to the `product_sources` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_sources_product_type_source_url_key";

-- DropIndex
DROP INDEX "product_updates_type_status_company_name_index";

-- AlterTable
ALTER TABLE "product_sources" ADD COLUMN     "external_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_updates" DROP COLUMN "product_company";

-- CreateIndex
CREATE UNIQUE INDEX "product_sources_product_type_source_key_external_key_key" ON "product_sources"("product_type", "source_key", "external_key");

-- CreateIndex
CREATE INDEX "product_updates_type_cpuId" ON "product_updates"("product_type", "cpu_id");

-- CreateIndex
CREATE INDEX "product_updates_type_gpuId" ON "product_updates"("product_type", "gpu_id");

-- CreateIndex
CREATE INDEX "product_updates_type_status_index" ON "product_updates"("product_type", "gpu_product_type", "status");
