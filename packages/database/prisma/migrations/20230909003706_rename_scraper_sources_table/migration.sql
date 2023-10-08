-- AlterTable
ALTER TABLE "scraper_sources" RENAME TO "automation_sources";

-- AlterTable
ALTER TABLE "automation_sources" RENAME CONSTRAINT "product_sources_pkey" TO "automation_sources_pkey";

-- RenameForeignKey
ALTER TABLE "automation_sources" RENAME CONSTRAINT "product_updates_gpu_chipset_id_foreign" TO "automationSources_gpuChipset_foreign";

-- RenameIndex
ALTER INDEX "product_sources_productType_archived_gpu_chipset_id_index" RENAME TO "automationSources_productType_archived_gpuChipsetId_index";

-- RenameIndex
ALTER INDEX "product_sources_product_type_source_key_external_key_key" RENAME TO "automationSources_productType_sourceKey_externalKey_unique";
