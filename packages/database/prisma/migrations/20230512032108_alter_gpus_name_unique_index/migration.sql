/*
  Warnings:

  - A unique constraint covering the columns `[company,name]` on the table `gpus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "gpus_name_unique";

-- CreateIndex
CREATE UNIQUE INDEX "gpus_company_name_key" ON "gpus"("company", "name");
