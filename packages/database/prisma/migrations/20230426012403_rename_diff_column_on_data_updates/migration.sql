/*
  Warnings:

  - You are about to drop the column `diff` on the `data_updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "data_updates" DROP COLUMN "diff",
ADD COLUMN     "data" BYTEA;

/*
  Delete existing updates; they are no longer relevant.
*/
DELETE FROM "data_updates";