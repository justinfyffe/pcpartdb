/*
  Warnings:

  - You are about to drop the column `geekbench_6_multiple_core` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `geekbench_6_single_core` on the `cpus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cpus" DROP COLUMN "geekbench_6_multiple_core",
DROP COLUMN "geekbench_6_single_core",
ADD COLUMN     "geekbench_multiple_core" DOUBLE PRECISION,
ADD COLUMN     "geekbench_single_core" DOUBLE PRECISION;
