/*
  Warnings:

  - You are about to drop the column `minutes_duration` on the `recorded_time` table. All the data in the column will be lost.
  - You are about to drop the column `register_date` on the `recorded_time` table. All the data in the column will be lost.
  - Added the required column `startedAt` to the `recorded_time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recorded_time" DROP COLUMN "minutes_duration",
DROP COLUMN "register_date",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
