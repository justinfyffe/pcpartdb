/*
  Warnings:

  - The primary key for the `product_benchmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_benchmarks` table. All the data in the column will be lost.
  - The primary key for the `product_ranks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_ranks` table. All the data in the column will be lost.
  - The primary key for the `product_sources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_sources` table. All the data in the column will be lost.
  - Made the column `product_id` on table `product_benchmarks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_ranks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_sources` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "productBenchmarks_productId_benchmarkKey_unique";

-- DropIndex
DROP INDEX "productRanks_productId_rankKey_unique";

-- DropIndex
DROP INDEX "productSources_productId_sourceKey_unique";

-- AlterTable
ALTER TABLE "product_benchmarks" DROP CONSTRAINT "product_benchmarks_pkey",
DROP COLUMN "id",
ALTER COLUMN "product_id" SET NOT NULL,
ADD CONSTRAINT "product_benchmarks_pkey" PRIMARY KEY ("product_id", "benchmark_key");

-- AlterTable
ALTER TABLE "product_ranks" DROP CONSTRAINT "product_ranks_pkey",
DROP COLUMN "id",
ALTER COLUMN "product_id" SET NOT NULL,
ADD CONSTRAINT "product_ranks_pkey" PRIMARY KEY ("product_id", "rank_key");

-- AlterTable
ALTER TABLE "product_sources" DROP CONSTRAINT "product_sources_pkey",
DROP COLUMN "id",
ALTER COLUMN "product_id" SET NOT NULL,
ADD CONSTRAINT "product_sources_pkey" PRIMARY KEY ("product_id", "source_key");
