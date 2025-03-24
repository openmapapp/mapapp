-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "confirmationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "disconfirmationCount" INTEGER NOT NULL DEFAULT 0;
