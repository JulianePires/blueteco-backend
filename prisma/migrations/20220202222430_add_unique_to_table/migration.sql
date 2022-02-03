/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "table" ADD COLUMN     "number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "table_number_key" ON "table"("number");
