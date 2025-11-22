/*
  Warnings:

  - Added the required column `is_actionable` to the `status_task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "status_task" ADD COLUMN     "is_actionable" BOOLEAN NOT NULL;
