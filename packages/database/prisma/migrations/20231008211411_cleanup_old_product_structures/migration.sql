/*
  Warnings:

  - You are about to drop the column `cpu_id` on the `product_updates` table. All the data in the column will be lost.
  - You are about to drop the column `gpu_id` on the `product_updates` table. All the data in the column will be lost.
  - You are about to drop the column `gpu_product_type` on the `product_updates` table. All the data in the column will be lost.
  - You are about to drop the `cpu_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cpus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gpu_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gpus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cpu_images" DROP CONSTRAINT "cpu_images_cpu_id_foreign";

-- DropForeignKey
ALTER TABLE "cpu_images" DROP CONSTRAINT "cpu_images_image_id_foreign";

-- DropForeignKey
ALTER TABLE "gpu_images" DROP CONSTRAINT "gpu_images_gpu_id_foreign";

-- DropForeignKey
ALTER TABLE "gpu_images" DROP CONSTRAINT "gpu_images_image_id_foreign";

-- DropForeignKey
ALTER TABLE "gpus" DROP CONSTRAINT "gpus_chipset_id_foreign";

-- DropForeignKey
ALTER TABLE "product_updates" DROP CONSTRAINT "product_updates_cpu_id_foreign";

-- DropForeignKey
ALTER TABLE "product_updates" DROP CONSTRAINT "product_updates_gpu_id_foreign";

-- AlterTable
ALTER TABLE "product_updates" DROP COLUMN "cpu_id",
DROP COLUMN "gpu_id",
DROP COLUMN "gpu_product_type";

-- DropTable
DROP TABLE "cpu_images";

-- DropTable
DROP TABLE "cpus";

-- DropTable
DROP TABLE "gpu_images";

-- DropTable
DROP TABLE "gpus";
