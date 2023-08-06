-- DropIndex
DROP INDEX "product_updates_type_status_company_name_index";

-- AlterTable
ALTER TABLE "product_sources" ADD COLUMN     "gpu_chipset_id" INTEGER;

-- AlterTable
ALTER TABLE "product_updates" ADD COLUMN     "gpu_product_type" TEXT;

-- CreateIndex
CREATE INDEX "product_updates_type_status_company_name_index" ON "product_updates"("product_type", "gpu_product_type", "status", "product_company", "product_name");

-- AddForeignKey
ALTER TABLE "product_sources" ADD CONSTRAINT "product_updates_gpu_chipset_id_foreign" FOREIGN KEY ("gpu_chipset_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
