/*
  Warnings:

  - Made the column `user_id` on table `item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_user_id_fkey";

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "userAssigned_id" INTEGER,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userAssigned_id_fkey" FOREIGN KEY ("userAssigned_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
