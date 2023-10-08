-- DropIndex
DROP INDEX "product_updates_type_gpuType_status_createdAt_index";

-- AlterTable
ALTER TABLE "product_updates" ADD COLUMN     "sub_product_type" TEXT;

-- CreateIndex
CREATE INDEX "product_updates_type_subProductType_status_createdAt_index" ON "product_updates"("product_type", "sub_product_type", "status", "created_at");
