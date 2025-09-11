/*
  Warnings:

  - Added the required column `address` to the `job_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `job_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `job_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceKey` to the `job_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."job_requests" ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "aparmentNumber" TEXT,
ADD COLUMN     "floor" TEXT,
ADD COLUMN     "jobCreationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "photos" JSONB,
ADD COLUMN     "position" JSONB NOT NULL,
ADD COLUMN     "propertyType" TEXT NOT NULL,
ADD COLUMN     "serviceKey" TEXT NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "extraData" DROP NOT NULL;
