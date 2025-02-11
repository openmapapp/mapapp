/*
  Warnings:

  - You are about to drop the column `type` on the `Report` table. All the data in the column will be lost.
  - Added the required column `reportTypeId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "type",
ADD COLUMN     "reportTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ReportType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportType_name_key" ON "ReportType"("name");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "ReportType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
