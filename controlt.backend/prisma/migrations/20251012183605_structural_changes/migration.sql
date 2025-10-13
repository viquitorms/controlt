/*
  Warnings:

  - Added the required column `updated_date` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
