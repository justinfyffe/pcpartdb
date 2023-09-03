-- DropIndex
DROP INDEX "cpus_automation_timestamp_index";

-- DropIndex
DROP INDEX "gpus_automation_timestamp_index";

-- DropIndex
DROP INDEX "product_sources_productType_sourceName_index";

-- DropIndex
DROP INDEX "product_updates_createdAt_index";

-- DropIndex
DROP INDEX "product_updates_productType_cpuId_index";

-- DropIndex
DROP INDEX "product_updates_productType_gpuId_index";

-- DropIndex
DROP INDEX "product_updates_productType_gpuProductType_status_index";

-- CreateIndex
CREATE INDEX "cpus_generation_index" ON "cpus"("generation");

-- CreateIndex
CREATE INDEX "cpus_marketSegments_index" ON "cpus"("market_segments");

-- CreateIndex
CREATE INDEX "cpus_releaseDate_index" ON "cpus"("release_date");

-- CreateIndex
CREATE INDEX "cpus_performanceScore_index" ON "cpus"("performance_score");

-- CreateIndex
CREATE INDEX "cpus_valueScore_index" ON "cpus"("value_score");

-- CreateIndex
CREATE INDEX "gpus_architecture_index" ON "gpus"("architecture");

-- CreateIndex
CREATE INDEX "gpus_marketSegment_index" ON "gpus"("market_segment");

-- CreateIndex
CREATE INDEX "gpus_releaseDate_index" ON "gpus"("release_date");

-- CreateIndex
CREATE INDEX "gpus_performanceScore_index" ON "gpus"("performance_score");

-- CreateIndex
CREATE INDEX "gpus_valueScore_index" ON "gpus"("value_score");

-- CreateIndex
CREATE INDEX "product_sources_productType_archived_gpu_chipset_id_index" ON "product_sources"("product_type", "archived", "gpu_chipset_id");

-- CreateIndex
CREATE INDEX "product_updates_type_gpuType_status_createdAt_index" ON "product_updates"("product_type", "gpu_product_type", "status", "created_at");
