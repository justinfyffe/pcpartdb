/*
  Warnings:

  - You are about to drop the column `status_updated_at` on the `product_updates` table. All the data in the column will be lost.
  - You are about to drop the `automation_queue` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "cpus" ADD COLUMN     "automation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "gpus" ADD COLUMN     "cpus_automation_timestamp_index" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_updates" DROP COLUMN "status_updated_at";

-- DropTable
DROP TABLE "automation_queue";

-- CreateTable
CREATE TABLE "automation_actions" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "data" BYTEA,
    "metadata" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "automation_actions_status_priority_timestamp_index" ON "automation_actions"("status", "priority" DESC, "timestamp" ASC);

-- CreateIndex
CREATE INDEX "cpus_automation_timestamp_index" ON "cpus"("automation_timestamp");

-- CreateIndex
CREATE INDEX "gpus_automation_timestamp_index" ON "gpus"("cpus_automation_timestamp_index");

-- CreateIndex
CREATE INDEX "product_updates_type_status_company_name_index" ON "product_updates"("product_type", "status", "product_company", "product_name");

-- CreateIndex
CREATE INDEX "product_updates_created_at_index" ON "product_updates"("created_at");

-- RenameIndex
ALTER INDEX "type_name" RENAME TO "product_sources_type_name_index";
