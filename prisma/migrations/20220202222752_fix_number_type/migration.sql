/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `table` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `number` on the `table` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "table" DROP COLUMN "number",
ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "table_number_key" ON "table"("number");
