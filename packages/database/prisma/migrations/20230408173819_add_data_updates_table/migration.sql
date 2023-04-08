-- CreateTable
CREATE TABLE "data_updates" (
    "id" SERIAL NOT NULL,
    "decision_user_id" INTEGER,
    "gpu_id" INTEGER,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "update_source" TEXT NOT NULL,
    "diff" JSONB,
    "metadata" JSONB,
    "decision_made_at" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_updates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "data_updates" ADD CONSTRAINT "data_updates_decision_user_id_foreign" FOREIGN KEY ("decision_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_updates" ADD CONSTRAINT "data_updates_gpu_id_foreign" FOREIGN KEY ("gpu_id") REFERENCES "gpus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
