/*
  Warnings:

  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `ItensOnTables` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birthDate` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItensOnTables" DROP CONSTRAINT "ItensOnTables_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItensOnTables" DROP CONSTRAINT "ItensOnTables_tableId_fkey";

-- AlterTable
ALTER TABLE "table" ADD COLUMN     "items" TEXT[];

-- AlterTable
ALTER TABLE "user" DROP COLUMN "birthday",
ADD COLUMN     "birthDate" TEXT NOT NULL;

-- DropTable
DROP TABLE "ItensOnTables";
