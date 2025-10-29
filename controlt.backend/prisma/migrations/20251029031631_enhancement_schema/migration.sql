/*
  Warnings:

  - You are about to drop the column `project_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `status_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status_id` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task" DROP CONSTRAINT "task_status_id_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task" DROP COLUMN "priority",
ADD COLUMN     "priority_id" INTEGER DEFAULT 3;

-- DropTable
DROP TABLE "public"."status_item";

-- CreateTable
CREATE TABLE "status_project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_task" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_priority" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "task_priority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_project_name_key" ON "status_project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "status_task_name_key" ON "status_task"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_priority_level_key" ON "task_priority"("level");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "task_priority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
