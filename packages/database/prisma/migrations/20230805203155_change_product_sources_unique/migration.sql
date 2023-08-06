/*
  Warnings:

  - A unique constraint covering the columns `[product_type,source_url]` on the table `product_sources` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_sources_product_type_source_key_source_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "product_sources_product_type_source_url_key" ON "product_sources"("product_type", "source_url");
