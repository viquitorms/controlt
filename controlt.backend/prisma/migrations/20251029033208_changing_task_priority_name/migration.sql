/*
  Warnings:

  - You are about to drop the column `color` on the `status_project` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `status_task` table. All the data in the column will be lost.
  - You are about to drop the `task_priority` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."task" DROP CONSTRAINT "task_priority_id_fkey";

-- AlterTable
ALTER TABLE "status_project" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "status_task" DROP COLUMN "color";

-- DropTable
DROP TABLE "public"."task_priority";

-- CreateTable
CREATE TABLE "priority_task" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "priority_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "priority_task_level_key" ON "priority_task"("level");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "priority_task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
