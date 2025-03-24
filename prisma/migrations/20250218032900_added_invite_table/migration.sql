/*
  Warnings:

  - You are about to drop the column `inviteCodes` on the `GlobalSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalSettings" DROP COLUMN "inviteCodes";

-- CreateTable
CREATE TABLE "InviteCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "usedBy" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");
