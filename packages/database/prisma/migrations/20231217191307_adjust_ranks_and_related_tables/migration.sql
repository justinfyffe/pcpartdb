/*
  Warnings:

  - The primary key for the `product_ranks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `metadata` on the `product_ranks` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `product_ranks` table. All the data in the column will be lost.
  - You are about to drop the column `rank_key` on the `product_ranks` table. All the data in the column will be lost.
  - You are about to drop the column `total_ranked` on the `product_ranks` table. All the data in the column will be lost.
  - The primary key for the `related_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `type` on the `related_products` table. All the data in the column will be lost.
  - Added the required column `ranks` to the `product_ranks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related_product_key` to the `related_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_ranks" DROP CONSTRAINT "productRanks_product_foreign";

-- AlterTable
DELETE FROM "product_ranks";
ALTER TABLE "product_ranks" DROP CONSTRAINT "product_ranks_pkey",
DROP COLUMN "metadata",
DROP COLUMN "rank",
DROP COLUMN "rank_key",
DROP COLUMN "total_ranked",
ADD COLUMN     "ranks" JSONB NOT NULL,
ADD CONSTRAINT "product_ranks_pkey" PRIMARY KEY ("product_id");

-- AlterTable
DELETE FROM "related_products";
ALTER TABLE "related_products" DROP CONSTRAINT "related_products_pkey",
DROP COLUMN "type",
ADD COLUMN     "related_product_key" TEXT NOT NULL,
ADD CONSTRAINT "related_products_pkey" PRIMARY KEY ("related_product_key", "product_id", "related_product_id");

-- AddForeignKey
ALTER TABLE "product_ranks" ADD CONSTRAINT "productRanks_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
