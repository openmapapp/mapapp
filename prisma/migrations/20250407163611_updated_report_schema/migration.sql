/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Report` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('ACTIVE', 'CONFIRMED', 'DISPUTED', 'RESOLVED', 'INCORRECT');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PRESENT', 'DEPARTED', 'UNKNOWN');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_submittedById_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "isVerified",
ADD COLUMN     "departureReportedById" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPermanent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itemStatus" "ItemStatus" NOT NULL DEFAULT 'PRESENT',
ADD COLUMN     "reportStatus" "ReportStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" TEXT;

-- CreateTable
CREATE TABLE "ReportStatusChange" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "previousStatus" "ReportStatus" NOT NULL,
    "newStatus" "ReportStatus" NOT NULL,
    "previousItemStatus" "ItemStatus" NOT NULL,
    "newItemStatus" "ItemStatus" NOT NULL,
    "changedById" TEXT,
    "deletedUserId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportStatusChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_departureReportedById_fkey" FOREIGN KEY ("departureReportedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStatusChange" ADD CONSTRAINT "ReportStatusChange_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStatusChange" ADD CONSTRAINT "ReportStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
