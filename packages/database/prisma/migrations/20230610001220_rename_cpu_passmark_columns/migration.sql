/*
  Warnings:

  - You are about to drop the column `cpu_mark` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `cpu_mark_multiple_thread` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `geekbench_multiple_core` on the `cpus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cpus" DROP COLUMN "cpu_mark",
DROP COLUMN "cpu_mark_multiple_thread",
DROP COLUMN "geekbench_multiple_core",
ADD COLUMN     "cpu_mark_multi_thread" DOUBLE PRECISION,
ADD COLUMN     "geekbench_multi_core" DOUBLE PRECISION;
