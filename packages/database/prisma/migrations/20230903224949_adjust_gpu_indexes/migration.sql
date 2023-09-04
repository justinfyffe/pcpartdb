/*
  Warnings:

  - A unique constraint covering the columns `[chipset_id,company,name]` on the table `gpus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "gpus_architecture_index";

-- DropIndex
DROP INDEX "gpus_company_name_key";

-- DropIndex
DROP INDEX "gpus_marketSegment_index";

-- DropIndex
DROP INDEX "gpus_performanceScore_index";

-- DropIndex
DROP INDEX "gpus_releaseDate_index";

-- DropIndex
DROP INDEX "gpus_valueScore_index";

-- CreateIndex
CREATE INDEX "gpus_chipsetId_architecture_index" ON "gpus"("chipset_id", "architecture");

-- CreateIndex
CREATE INDEX "gpus_chipsetId_marketSegment_index" ON "gpus"("chipset_id", "market_segment");

-- CreateIndex
CREATE INDEX "gpus_chipsetId_releaseDate_index" ON "gpus"("chipset_id", "release_date");

-- CreateIndex
CREATE INDEX "gpus_chipsetId_performanceScore_index" ON "gpus"("chipset_id", "performance_score");

-- CreateIndex
CREATE INDEX "gpus_chipsetId_valueScore_index" ON "gpus"("chipset_id", "value_score");

-- CreateIndex
CREATE UNIQUE INDEX "gpus_chipset_id_company_name_key" ON "gpus"("chipset_id", "company", "name");
