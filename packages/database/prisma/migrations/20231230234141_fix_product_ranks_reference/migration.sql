-- DropForeignKey
ALTER TABLE "product_ranks" DROP CONSTRAINT "productRanks_product_foreign";

-- AddForeignKey
ALTER TABLE "product_ranks" ADD CONSTRAINT "productRanks_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
