-- DropForeignKey
ALTER TABLE "gpus" DROP CONSTRAINT "gpus_parent_id_foreign";

-- AlterTable
ALTER TABLE "gpus" RENAME COLUMN "parent_id" TO "chipset_id";

-- AddForeignKey
ALTER TABLE "gpus" ADD CONSTRAINT "gpus_chipset_id_foreign" FOREIGN KEY ("chipset_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
