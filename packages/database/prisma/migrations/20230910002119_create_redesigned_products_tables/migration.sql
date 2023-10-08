-- AlterTable
ALTER TABLE "automation_sources" ADD COLUMN     "related_product_id" INTEGER;

-- AlterTable
ALTER TABLE "product_updates" ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "product_id" INTEGER,
ADD COLUMN     "started_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "slug" TEXT NOT NULL,
    "product_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "other_names" TEXT[],
    "company" TEXT,
    "search_text" TEXT NOT NULL,
    "affiliate_url" TEXT,
    "metadata" JSONB,
    "automated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_benchmarks" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "benchmark_key" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sources" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "source_key" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "metadata" JSONB,
    "scraped_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "product_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("product_id","image_id")
);

-- CreateTable
CREATE TABLE "cpu_fields" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "architecture_value" TEXT,
    "architecture_meta" JSONB,
    "base_clock_value" DOUBLE PRECISION,
    "base_clock_meta" JSONB,
    "bundled_cooler_value" TEXT,
    "bundled_cooler_meta" JSONB,
    "chipsets_value" TEXT,
    "chipsets_meta" JSONB,
    "clock_value" DOUBLE PRECISION,
    "clock_meta" JSONB,
    "codename_value" TEXT,
    "codename_meta" JSONB,
    "cores_value" DOUBLE PRECISION,
    "cores_meta" JSONB,
    "die_size_value" DOUBLE PRECISION,
    "die_size_meta" JSONB,
    "ecc_memory_value" BOOLEAN,
    "ecc_memory_meta" JSONB,
    "e_cores_value" DOUBLE PRECISION,
    "e_cores_meta" JSONB,
    "e_core_clock_value" DOUBLE PRECISION,
    "e_core_clock_meta" JSONB,
    "e_core_l1_cache_value" DOUBLE PRECISION,
    "e_core_l1_cache_meta" JSONB,
    "e_core_l2_cache_value" DOUBLE PRECISION,
    "e_core_l2_cache_meta" JSONB,
    "e_core_turbo_clock_value" DOUBLE PRECISION,
    "e_core_turbo_clock_meta" JSONB,
    "extensions_technologies_value" TEXT,
    "extensions_technologies_meta" JSONB,
    "foundry_value" TEXT,
    "foundry_meta" JSONB,
    "generation_value" TEXT,
    "generation_meta" JSONB,
    "integrated_graphics_value" TEXT,
    "integrated_graphics_meta" JSONB,
    "l1_cache_value" DOUBLE PRECISION,
    "l1_cache_meta" JSONB,
    "l2_cache_value" DOUBLE PRECISION,
    "l2_cache_meta" JSONB,
    "l3_cache_value" DOUBLE PRECISION,
    "l3_cache_meta" JSONB,
    "market_segment_value" TEXT,
    "market_segment_meta" JSONB,
    "memory_channels_value" DOUBLE PRECISION,
    "memory_channels_meta" JSONB,
    "memory_support_value" TEXT,
    "memory_support_meta" JSONB,
    "msrp_value" DOUBLE PRECISION,
    "msrp_meta" JSONB,
    "multiplier_value" DOUBLE PRECISION,
    "multiplier_meta" JSONB,
    "multiplier_unlocked_value" BOOLEAN,
    "multiplier_unlocked_meta" JSONB,
    "part_number_value" TEXT,
    "part_number_meta" JSONB,
    "pci_express_value" TEXT,
    "pci_express_meta" JSONB,
    "p_cores_value" DOUBLE PRECISION,
    "p_cores_meta" JSONB,
    "p_core_clock_value" DOUBLE PRECISION,
    "p_core_clock_meta" JSONB,
    "p_core_turbo_clock_value" DOUBLE PRECISION,
    "p_core_turbo_clock_meta" JSONB,
    "pl1_value" DOUBLE PRECISION,
    "pl1_meta" JSONB,
    "pl2_value" DOUBLE PRECISION,
    "pl2_meta" JSONB,
    "ppt_value" DOUBLE PRECISION,
    "ppt_meta" JSONB,
    "process_size_value" DOUBLE PRECISION,
    "process_size_meta" JSONB,
    "production_status_value" TEXT,
    "production_status_meta" JSONB,
    "release_date_value" TEXT,
    "release_date_meta" JSONB,
    "smp_value" DOUBLE PRECISION,
    "smp_meta" JSONB,
    "socket_value" TEXT,
    "socket_meta" JSONB,
    "t_case_max_value" DOUBLE PRECISION,
    "t_case_max_meta" JSONB,
    "tdp_value" DOUBLE PRECISION,
    "tdp_meta" JSONB,
    "threads_value" DOUBLE PRECISION,
    "threads_meta" JSONB,
    "tj_max_value" DOUBLE PRECISION,
    "tj_max_meta" JSONB,
    "transistors_value" DOUBLE PRECISION,
    "transistors_meta" JSONB,
    "turbo_clock_value" DOUBLE PRECISION,
    "turbo_clock_meta" JSONB,
    "performance_rating_value" DOUBLE PRECISION,
    "performance_rating_meta" JSONB,
    "performance_per_msrp_value" DOUBLE PRECISION,
    "performance_per_msrp_meta" JSONB,
    "metadata" JSONB,

    CONSTRAINT "cpu_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpu_fields" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "architecture_value" TEXT,
    "architecture_meta" JSONB,
    "bus_interface_value" TEXT,
    "bus_interface_meta" JSONB,
    "codename_value" TEXT,
    "codename_meta" JSONB,
    "compute_units_value" DOUBLE PRECISION,
    "compute_units_meta" JSONB,
    "cuda_version_value" TEXT,
    "cuda_version_meta" JSONB,
    "density_value" DOUBLE PRECISION,
    "density_meta" JSONB,
    "die_size_value" DOUBLE PRECISION,
    "die_size_meta" JSONB,
    "directx_version_value" TEXT,
    "directx_version_meta" JSONB,
    "foundry_value" TEXT,
    "foundry_meta" JSONB,
    "fp16_value" DOUBLE PRECISION,
    "fp16_meta" JSONB,
    "fp32_value" DOUBLE PRECISION,
    "fp32_meta" JSONB,
    "fp64_value" DOUBLE PRECISION,
    "fp64_meta" JSONB,
    "generation_value" TEXT,
    "generation_meta" JSONB,
    "gpu_cores_value" DOUBLE PRECISION,
    "gpu_cores_meta" JSONB,
    "gpu_core_base_clock_value" DOUBLE PRECISION,
    "gpu_core_base_clock_meta" JSONB,
    "gpu_core_boost_clock_value" DOUBLE PRECISION,
    "gpu_core_boost_clock_meta" JSONB,
    "height_value" DOUBLE PRECISION,
    "height_meta" JSONB,
    "l1_cache_value" DOUBLE PRECISION,
    "l1_cache_meta" JSONB,
    "l2_cache_value" DOUBLE PRECISION,
    "l2_cache_meta" JSONB,
    "length_value" DOUBLE PRECISION,
    "length_meta" JSONB,
    "market_segment_value" TEXT,
    "market_segment_meta" JSONB,
    "memory_bandwidth_value" DOUBLE PRECISION,
    "memory_bandwidth_meta" JSONB,
    "memory_clock_value" DOUBLE PRECISION,
    "memory_clock_meta" JSONB,
    "memory_clock_effective_value" DOUBLE PRECISION,
    "memory_clock_effective_meta" JSONB,
    "memory_interface_value" DOUBLE PRECISION,
    "memory_interface_meta" JSONB,
    "memory_size_value" DOUBLE PRECISION,
    "memory_size_meta" JSONB,
    "memory_type_value" TEXT,
    "memory_type_meta" JSONB,
    "msrp_value" DOUBLE PRECISION,
    "msrp_meta" JSONB,
    "open_cl_version_value" TEXT,
    "open_cl_version_meta" JSONB,
    "open_gl_version_value" TEXT,
    "open_gl_version_meta" JSONB,
    "outputs_value" TEXT,
    "outputs_meta" JSONB,
    "part_number_value" TEXT,
    "part_number_meta" JSONB,
    "pixel_rate_value" DOUBLE PRECISION,
    "pixel_rate_meta" JSONB,
    "pixel_shaders_value" DOUBLE PRECISION,
    "pixel_shaders_meta" JSONB,
    "power_connectors_value" TEXT,
    "power_connectors_meta" JSONB,
    "predecessor_generation_value" TEXT,
    "predecessor_generation_meta" JSONB,
    "process_size_value" DOUBLE PRECISION,
    "process_size_meta" JSONB,
    "production_status_value" TEXT,
    "production_status_meta" JSONB,
    "release_date_value" TEXT,
    "release_date_meta" JSONB,
    "rops_value" DOUBLE PRECISION,
    "rops_meta" JSONB,
    "rt_cores_value" DOUBLE PRECISION,
    "rt_cores_meta" JSONB,
    "shader_clock_value" DOUBLE PRECISION,
    "shader_clock_meta" JSONB,
    "shader_model_version_value" TEXT,
    "shader_model_version_meta" JSONB,
    "slot_width_value" DOUBLE PRECISION,
    "slot_width_meta" JSONB,
    "successor_generation_value" TEXT,
    "successor_generation_meta" JSONB,
    "suggested_psu_value" DOUBLE PRECISION,
    "suggested_psu_meta" JSONB,
    "tdp_value" DOUBLE PRECISION,
    "tdp_meta" JSONB,
    "tensor_cores_value" DOUBLE PRECISION,
    "tensor_cores_meta" JSONB,
    "texture_rate_value" DOUBLE PRECISION,
    "texture_rate_meta" JSONB,
    "tmus_value" DOUBLE PRECISION,
    "tmus_meta" JSONB,
    "transistors_value" DOUBLE PRECISION,
    "transistors_meta" JSONB,
    "vertex_rate_value" DOUBLE PRECISION,
    "vertex_rate_meta" JSONB,
    "vertex_shaders_value" DOUBLE PRECISION,
    "vertex_shaders_meta" JSONB,
    "vulkan_version_value" TEXT,
    "vulkan_version_meta" JSONB,
    "weight_value" DOUBLE PRECISION,
    "weight_meta" JSONB,
    "width_value" DOUBLE PRECISION,
    "width_meta" JSONB,
    "performance_rating_value" DOUBLE PRECISION,
    "performance_rating_meta" JSONB,
    "performance_per_msrp_value" DOUBLE PRECISION,
    "performance_per_msrp_meta" JSONB,
    "metadata" JSONB,

    CONSTRAINT "gpu_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_productType_slug_unique" ON "products"("product_type", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "productBenchmarks_productId_benchmarkKey_unique" ON "product_benchmarks"("product_id", "benchmark_key");

-- CreateIndex
CREATE UNIQUE INDEX "productSources_productId_sourceKey_unique" ON "product_sources"("product_id", "source_key");

-- CreateIndex
CREATE UNIQUE INDEX "productSources_sourceUrl_productId_unique" ON "product_sources"("source_url", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "cpuFields_productId_unique" ON "cpu_fields"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "gpuFields_productId_unique" ON "gpu_fields"("product_id");

-- CreateIndex
CREATE INDEX "automationSources_productType_archived_relatedProductId_index" ON "automation_sources"("product_type", "archived", "related_product_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_parent_foreign" FOREIGN KEY ("parent_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_benchmarks" ADD CONSTRAINT "productBenchmarks_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_sources" ADD CONSTRAINT "productSources_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_updates" ADD CONSTRAINT "productUpdates_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "productImages_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "productImages_image_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "automation_sources" ADD CONSTRAINT "automationSources_relatedProduct_foreign" FOREIGN KEY ("related_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cpu_fields" ADD CONSTRAINT "cpuFields_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpu_fields" ADD CONSTRAINT "gpuFields_product_foreign" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
