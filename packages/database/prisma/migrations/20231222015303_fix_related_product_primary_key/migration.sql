/*
  Warnings:

  - The primary key for the `related_products` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
DELETE FROM "related_products";
ALTER TABLE "related_products" DROP CONSTRAINT "related_products_pkey",
ADD CONSTRAINT "related_products_pkey" PRIMARY KEY ("product_id", "related_product_id", "related_product_key");
