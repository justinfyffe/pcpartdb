-- AlterTable
ALTER TABLE "data_updates" ADD COLUMN     "cpu_id" INTEGER;

-- CreateTable
CREATE TABLE "cpu_images" (
    "cpu_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cpu_images_pkey" PRIMARY KEY ("cpu_id","image_id")
);

-- CreateTable
CREATE TABLE "cpus" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "affiliate_url" VARCHAR(255),
    "part_number" TEXT,
    "company" TEXT,
    "market_segments" TEXT[],
    "launch_price" DOUBLE PRECISION,
    "release_date" TEXT,
    "production_status" TEXT,
    "has_bundled_cooler" BOOLEAN,
    "socket" TEXT,
    "foundry" TEXT,
    "process_size" DOUBLE PRECISION,
    "transistors" DOUBLE PRECISION,
    "die_size" DOUBLE PRECISION,
    "t_case_max" DOUBLE PRECISION,
    "tj_max" DOUBLE PRECISION,
    "data_width" DOUBLE PRECISION,
    "codename" TEXT,
    "generation" TEXT,
    "pci_express" JSONB,
    "chipsets" TEXT,
    "memory_types" JSONB,
    "memory_channels" DOUBLE PRECISION,
    "max_memory_size" DOUBLE PRECISION,
    "has_ecc_memory" BOOLEAN,
    "cores_count" DOUBLE PRECISION,
    "threads_count" DOUBLE PRECISION,
    "performance_cores_count" DOUBLE PRECISION,
    "efficient_cores_count" DOUBLE PRECISION,
    "clock" DOUBLE PRECISION,
    "turbo_clock" DOUBLE PRECISION,
    "performance_core_clock" DOUBLE PRECISION,
    "performance_core_turbo_clock" DOUBLE PRECISION,
    "efficient_core_clock" DOUBLE PRECISION,
    "efficient_core_turbo_clock" DOUBLE PRECISION,
    "base_clock" DOUBLE PRECISION,
    "multiplier" DOUBLE PRECISION,
    "is_multiplier_unlocked" BOOLEAN,
    "base_tdp" DOUBLE PRECISION,
    "turbo_tdp" DOUBLE PRECISION,
    "l1_cache" DOUBLE PRECISION,
    "l2_cache" DOUBLE PRECISION,
    "l3_cache" DOUBLE PRECISION,
    "efficient_core_l1_cache" DOUBLE PRECISION,
    "efficient_core_l2_cache" DOUBLE PRECISION,
    "integrated_graphics" TEXT,
    "has_integrated_graphics" BOOLEAN,
    "extensions_technologies" TEXT[],
    "performance_score" DOUBLE PRECISION,
    "value_score" DOUBLE PRECISION,
    "cpu_mark" DOUBLE PRECISION,
    "cpu_mark_single_thread" DOUBLE PRECISION,
    "cpu_mark_multiple_thread" DOUBLE PRECISION,
    "geekbench_6_single_core" DOUBLE PRECISION,
    "geekbench_6_multiple_core" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cpus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cpus_slug_unique" ON "cpus"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cpus_company_name_key" ON "cpus"("company", "name");

-- AddForeignKey
ALTER TABLE "cpu_images" ADD CONSTRAINT "cpu_images_cpu_id_foreign" FOREIGN KEY ("cpu_id") REFERENCES "cpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cpu_images" ADD CONSTRAINT "cpu_images_image_id_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_updates" ADD CONSTRAINT "data_updates_cpu_id_foreign" FOREIGN KEY ("cpu_id") REFERENCES "cpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
