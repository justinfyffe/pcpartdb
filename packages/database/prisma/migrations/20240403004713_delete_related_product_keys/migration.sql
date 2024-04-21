/*
  Warnings:

  - The primary key for the `related_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `related_product_key` on the `related_products` table. All the data in the column will be lost.

*/
-- AlterTable
DELETE FROM "related_products";
ALTER TABLE "related_products" DROP CONSTRAINT "related_products_pkey",
DROP COLUMN "related_product_key",
ADD CONSTRAINT "related_products_pkey" PRIMARY KEY ("product_id", "related_product_id");
