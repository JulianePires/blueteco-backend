-- DropForeignKey
ALTER TABLE "table" DROP CONSTRAINT "table_userId_fkey";

-- AlterTable
ALTER TABLE "table" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "table" ADD CONSTRAINT "table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
