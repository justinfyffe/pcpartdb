/*
  Warnings:

  - You are about to drop the column `enable_performance_summary` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `summary_published_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `summary_stale` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "enable_performance_summary",
DROP COLUMN "summary",
DROP COLUMN "summary_published_at",
DROP COLUMN "summary_stale";
