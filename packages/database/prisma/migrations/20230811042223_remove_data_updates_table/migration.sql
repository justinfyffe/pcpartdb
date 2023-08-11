/*
  Warnings:

  - You are about to drop the `data_updates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "data_updates" DROP CONSTRAINT "data_updates_cpu_id_foreign";

-- DropForeignKey
ALTER TABLE "data_updates" DROP CONSTRAINT "data_updates_decision_user_id_foreign";

-- DropForeignKey
ALTER TABLE "data_updates" DROP CONSTRAINT "data_updates_gpu_id_foreign";

-- DropTable
DROP TABLE "data_updates";
