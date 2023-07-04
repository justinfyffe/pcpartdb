/*
  Warnings:

  - You are about to drop the column `base_tdp` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `has_bundled_cooler` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `memory_types` on the `cpus` table. All the data in the column will be lost.
  - You are about to drop the column `turbo_tdp` on the `cpus` table. All the data in the column will be lost.
  - The `pci_express` column on the `cpus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `chipsets` column on the `cpus` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cpus" DROP COLUMN "base_tdp",
DROP COLUMN "has_bundled_cooler",
DROP COLUMN "memory_types",
DROP COLUMN "turbo_tdp",
ADD COLUMN     "bundled_cooler" TEXT,
ADD COLUMN     "memory_support" TEXT[],
ADD COLUMN     "pl1" DOUBLE PRECISION,
ADD COLUMN     "pl2" DOUBLE PRECISION,
ADD COLUMN     "ppt" DOUBLE PRECISION,
ADD COLUMN     "tdp" DOUBLE PRECISION,
DROP COLUMN "pci_express",
ADD COLUMN     "pci_express" TEXT[],
DROP COLUMN "chipsets",
ADD COLUMN     "chipsets" TEXT[];
