/*
  Warnings:

  - You are about to drop the column `trust` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalSettings" ADD COLUMN     "verifyPermission" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "trust";
