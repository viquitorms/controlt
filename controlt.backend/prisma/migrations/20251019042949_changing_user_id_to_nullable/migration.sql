-- DropForeignKey
ALTER TABLE "public"."item" DROP CONSTRAINT "item_user_id_fkey";

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
