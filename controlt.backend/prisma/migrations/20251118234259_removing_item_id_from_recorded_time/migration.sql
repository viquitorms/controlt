/*
  Warnings:

  - You are about to drop the column `item_id` on the `recorded_time` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."recorded_time" DROP CONSTRAINT "recorded_time_item_id_fkey";

-- AlterTable
ALTER TABLE "recorded_time" DROP COLUMN "item_id";
