-- DropIndex
DROP INDEX "cpus_generation_index";

-- DropIndex
DROP INDEX "cpus_marketSegments_index";

-- DropIndex
DROP INDEX "cpus_performanceScore_index";

-- DropIndex
DROP INDEX "cpus_valueScore_index";

-- DropIndex
DROP INDEX "gpus_chipsetId_performanceScore_index";

-- DropIndex
DROP INDEX "gpus_chipsetId_valueScore_index";

-- AlterTable
ALTER TABLE "cpus" ADD COLUMN     "market_segment" TEXT;

-- CreateIndex
CREATE INDEX "cpus_marketSegment_index" ON "cpus"("market_segment");
