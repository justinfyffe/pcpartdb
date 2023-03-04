-- CreateTable
CREATE TABLE "access_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpu_benchmarks" (
    "gpu_id" INTEGER NOT NULL,
    "performance_score" DOUBLE PRECISION,
    "value_score" DOUBLE PRECISION,
    "g3d_mark" DOUBLE PRECISION,
    "g2d_mark" DOUBLE PRECISION,
    "timespy_graphics" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gpu_benchmarks_pkey" PRIMARY KEY ("gpu_id")
);

-- CreateTable
CREATE TABLE "gpu_images" (
    "gpu_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gpu_images_pkey" PRIMARY KEY ("gpu_id","image_id")
);

-- CreateTable
CREATE TABLE "gpu_specs" (
    "gpu_id" INTEGER NOT NULL,
    "codename" TEXT,
    "architecture" TEXT,
    "process_size" DOUBLE PRECISION,
    "transistors" DOUBLE PRECISION,
    "memory_size" DOUBLE PRECISION,
    "memory_type" TEXT,
    "memory_clock" DOUBLE PRECISION,
    "memory_interface" DOUBLE PRECISION,
    "memory_bandwidth" DOUBLE PRECISION,
    "slot_width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "thermal_design_power" DOUBLE PRECISION,
    "suggested_psu" DOUBLE PRECISION,
    "bus_interface" TEXT,
    "power_connectors" TEXT,
    "outputs" TEXT,
    "shader_units_cuda_cores" DOUBLE PRECISION,
    "texture_mapping_units" DOUBLE PRECISION,
    "render_output_units" DOUBLE PRECISION,
    "tensor_cores" DOUBLE PRECISION,
    "ray_tracing_cores" DOUBLE PRECISION,
    "core_clock_speed_base" DOUBLE PRECISION,
    "core_clock_speed_boost" DOUBLE PRECISION,
    "l1_cache " DOUBLE PRECISION,
    "l2_cache" DOUBLE PRECISION,
    "pixel_fill_rate" DOUBLE PRECISION,
    "texture_fill_rate" DOUBLE PRECISION,
    "fp32_performance" DOUBLE PRECISION,
    "fp64_performance" DOUBLE PRECISION,
    "directx_version" TEXT,
    "open_cl_version" TEXT,
    "open_gl_version" TEXT,
    "shader_model_version" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gpu_specs_pkey" PRIMARY KEY ("gpu_id")
);

-- CreateTable
CREATE TABLE "gpus" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "affiliate_url" VARCHAR(255),
    "company" TEXT,
    "market_segment" TEXT,
    "launch_price" DOUBLE PRECISION,
    "release_date" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gpus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "source_name" VARCHAR(255),
    "source_url" VARCHAR(255),
    "file_size" INTEGER,
    "height" INTEGER,
    "width" INTEGER,
    "uploaded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_staff" BOOLEAN DEFAULT false,
    "registered_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_token_hash_unique" ON "access_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "access_tokens_expires_at_index" ON "access_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "gpus_slug_unique" ON "gpus"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "gpus_name_unique" ON "gpus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "images_path_unique" ON "images"("path");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpu_benchmarks" ADD CONSTRAINT "gpu_benchmarks_gpu_id_foreign" FOREIGN KEY ("gpu_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpu_images" ADD CONSTRAINT "gpu_images_gpu_id_foreign" FOREIGN KEY ("gpu_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpu_images" ADD CONSTRAINT "gpu_images_image_id_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpu_specs" ADD CONSTRAINT "gpu_specs_gpu_id_foreign" FOREIGN KEY ("gpu_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gpus" ADD CONSTRAINT "gpus_parent_id_foreign" FOREIGN KEY ("parent_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
