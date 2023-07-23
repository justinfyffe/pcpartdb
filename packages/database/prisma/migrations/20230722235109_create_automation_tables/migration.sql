-- CreateTable
CREATE TABLE "product_sources" (
    "id" SERIAL NOT NULL,
    "product_type" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_key" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_updates" (
    "id" SERIAL NOT NULL,
    "product_type" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_company" TEXT,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "data" BYTEA,
    "metadata" JSONB,
    "cpu_id" INTEGER,
    "gpu_id" INTEGER,
    "status_updated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_queue" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "action" TEXT,
    "data" BYTEA,
    "metadata" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedAt" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "type_name" ON "product_sources"("product_type", "source_name");

-- CreateIndex
CREATE UNIQUE INDEX "product_sources_product_type_source_key_source_url_key" ON "product_sources"("product_type", "source_key", "source_url");

-- AddForeignKey
ALTER TABLE "product_updates" ADD CONSTRAINT "product_updates_cpu_id_foreign" FOREIGN KEY ("cpu_id") REFERENCES "cpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_updates" ADD CONSTRAINT "product_updates_gpu_id_foreign" FOREIGN KEY ("gpu_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
