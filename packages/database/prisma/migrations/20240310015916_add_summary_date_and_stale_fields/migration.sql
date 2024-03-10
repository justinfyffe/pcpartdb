-- AlterTable
ALTER TABLE "products" ADD COLUMN     "summary_published_at" TIMESTAMPTZ(6),
ADD COLUMN     "summary_stale" BOOLEAN DEFAULT false;
