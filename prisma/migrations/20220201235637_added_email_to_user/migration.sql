/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('OPEN', 'CLOSED');

-- DropIndex
DROP INDEX "user_name_key";

-- AlterTable
ALTER TABLE "table" ADD COLUMN     "state" "State" NOT NULL DEFAULT E'CLOSED';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
