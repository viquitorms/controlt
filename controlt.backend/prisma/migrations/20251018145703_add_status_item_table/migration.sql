/*
  Warnings:

  - You are about to drop the column `status` on the `item` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "status_item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_item_name_key" ON "status_item"("name");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
