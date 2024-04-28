/*
  Warnings:

  - You are about to drop the column `related_product_id` on the `automation_sources` table. All the data in the column will be lost.
  - You are about to drop the column `height_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `height_value` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `length_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `length_value` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `weight_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `weight_value` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `width_meta` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `width_value` on the `gpu_fields` table. All the data in the column will be lost.
  - You are about to drop the column `sub_product_type` on the `product_updates` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `products` table. All the data in the column will be lost.

*/

DELETE FROM "automation_sources" WHERE "related_product_id" IS NOT NULL;
DELETE FROM "products" WHERE "parent_id" IS NOT NULL;
DELETE FROM "product_updates" WHERE "sub_product_type" = 'GPU_RETAIL_MODEL';

-- DropForeignKey
ALTER TABLE "automation_sources" DROP CONSTRAINT "automationSources_relatedProduct_foreign";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_parent_foreign";

-- DropIndex
DROP INDEX "automationSources_productType_archived_relatedProductId_index";

-- DropIndex
DROP INDEX "product_updates_type_subProductType_status_createdAt_index";

-- DropIndex
DROP INDEX "products_parentId_index";

-- AlterTable
ALTER TABLE "automation_sources" DROP COLUMN "related_product_id";

-- AlterTable
ALTER TABLE "gpu_fields" DROP COLUMN "height_meta",
DROP COLUMN "height_value",
DROP COLUMN "length_meta",
DROP COLUMN "length_value",
DROP COLUMN "weight_meta",
DROP COLUMN "weight_value",
DROP COLUMN "width_meta",
DROP COLUMN "width_value";

-- AlterTable
ALTER TABLE "product_updates" DROP COLUMN "sub_product_type";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "parent_id";

-- CreateIndex
CREATE INDEX "automationSources_productType_archived_index" ON "automation_sources"("product_type", "archived");

-- CreateIndex
CREATE INDEX "product_updates_type_status_createdAt_index" ON "product_updates"("product_type", "status", "created_at");
