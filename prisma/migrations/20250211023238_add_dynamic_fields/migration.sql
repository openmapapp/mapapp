/*
  Warnings:

  - The `description` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `fields` to the `ReportType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;

-- AlterTable
ALTER TABLE "ReportType" ADD COLUMN     "fields" JSONB NOT NULL;
