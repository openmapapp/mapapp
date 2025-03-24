/*
  Warnings:

  - You are about to drop the column `votesOpenToVisitors` on the `GlobalSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalSettings" DROP COLUMN "votesOpenToVisitors";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "userId" DROP NOT NULL;
