/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the `termo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uesr_id` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."itens" DROP CONSTRAINT "itens_usuario_id_fkey";

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "usuario_id",
ADD COLUMN     "uesr_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."termo";

-- CreateTable
CREATE TABLE "term" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "term_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_uesr_id_fkey" FOREIGN KEY ("uesr_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
