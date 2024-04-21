-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_short" TEXT,
    "description" TEXT,
    "publisher" TEXT,
    "developer" TEXT,
    "release_date" TEXT,
    "affiliate_url" TEXT,
    "game_settings" JSONB,
    "scraper_options" JSONB,
    "minimum_requirements" JSONB,
    "recommended_requirements" JSONB,
    "minimum_gpu_id" INTEGER,
    "recommended_gpu_id" INTEGER,
    "minimum_cpu_id" INTEGER,
    "recommended_cpu_id" INTEGER,
    "listing_image_id" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_game_fps" (
    "product_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "settings_preset_key" TEXT NOT NULL,
    "fps" DOUBLE PRECISION,
    "fps_per_dollar" DOUBLE PRECISION,
    "dollars_per_frame" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_game_fps_pkey" PRIMARY KEY ("product_id","game_id","settings_preset_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_unique" ON "games"("slug");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "game_minimumGpu_foreign" FOREIGN KEY ("minimum_gpu_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "game_recommendedGpu_foreign" FOREIGN KEY ("recommended_gpu_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "game_minimumCpu_foreign" FOREIGN KEY ("minimum_cpu_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "game_recommendedCpu_foreign" FOREIGN KEY ("recommended_cpu_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "game_listingImage_foreign" FOREIGN KEY ("listing_image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_game_fps" ADD CONSTRAINT "gameFps_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_game_fps" ADD CONSTRAINT "gameFps_game_foreign" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
