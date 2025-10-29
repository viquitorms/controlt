/*
  Warnings:

  - You are about to drop the column `description` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `userAssigned_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `item` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_userAssigned_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recorded_time" DROP CONSTRAINT "recorded_time_item_id_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "description",
DROP COLUMN "due_date",
DROP COLUMN "priority",
DROP COLUMN "status_id",
DROP COLUMN "updated_date",
DROP COLUMN "userAssigned_id",
DROP COLUMN "user_id",
ADD COLUMN     "created_by_id" INTEGER NOT NULL,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "recorded_time" ADD COLUMN     "task_id" INTEGER,
ALTER COLUMN "item_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" INTEGER DEFAULT 3,
    "project_id" INTEGER,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "status_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "assigned_to_id" INTEGER,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_status_id_idx" ON "task"("status_id");

-- CreateIndex
CREATE INDEX "task_assigned_to_id_idx" ON "task"("assigned_to_id");

-- CreateIndex
CREATE INDEX "task_created_date_idx" ON "task"("created_date");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recorded_time" ADD CONSTRAINT "recorded_time_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recorded_time" ADD CONSTRAINT "recorded_time_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
