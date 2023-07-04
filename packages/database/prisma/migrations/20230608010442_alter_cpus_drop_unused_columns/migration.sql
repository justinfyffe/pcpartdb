/*
  Warnings:

  - You are about to drop the column `data_width` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `max_memory_size` on the `cpus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cpus" DROP COLUMN "data_width",
DROP COLUMN "max_memory_size";
