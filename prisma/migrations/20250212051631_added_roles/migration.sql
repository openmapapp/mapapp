-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMINISTRATOR');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" SERIAL NOT NULL,
    "mapCenterLat" DOUBLE PRECISION NOT NULL DEFAULT 40.730610,
    "mapCenterLng" DOUBLE PRECISION NOT NULL DEFAULT -73.935242,
    "mapBoundsSwLat" DOUBLE PRECISION,
    "mapBoundsSwLng" DOUBLE PRECISION,
    "mapBoundsNeLat" DOUBLE PRECISION,
    "mapBoundsNeLng" DOUBLE PRECISION,
    "openToVisitors" BOOLEAN NOT NULL DEFAULT true,
    "registrationMode" TEXT NOT NULL DEFAULT 'open',
    "inviteCodes" TEXT,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);
