/*
  Warnings:

  - You are about to drop the column `uesr_id` on the `itens` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."itens" DROP CONSTRAINT "itens_uesr_id_fkey";

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "uesr_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
