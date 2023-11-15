-- CreateTable
CREATE TABLE "product_ranks" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "rank_key" TEXT NOT NULL,
    "rank" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "related_products" (
    "product_id" INTEGER NOT NULL,
    "related_product_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "related_products_pkey" PRIMARY KEY ("type","product_id","related_product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productRanks_productId_rankKey_unique" ON "product_ranks"("product_id", "rank_key");

-- AddForeignKey
ALTER TABLE "product_ranks" ADD CONSTRAINT "productRanks_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "related_products" ADD CONSTRAINT "relatedProducts_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "related_products" ADD CONSTRAINT "relatedProducts_relatedProduct_foreign" FOREIGN KEY ("related_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
