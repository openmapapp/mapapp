/*
  Warnings:

  - You are about to drop the column `openToVisitors` on the `GlobalSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalSettings" DROP COLUMN "openToVisitors",
ADD COLUMN     "mapOpenToVisitors" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "submitReportsOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "votesOpenToVisitors" BOOLEAN NOT NULL DEFAULT false;
