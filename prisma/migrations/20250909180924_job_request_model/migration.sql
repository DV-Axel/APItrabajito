/*
  Warnings:

  - You are about to drop the column `attachments` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `includesMaterials` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `requiresVisit` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `selectedApplicationId` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `job_requests` table. All the data in the column will be lost.
  - You are about to drop the `applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_request_statuses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `job_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraData` to the `job_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgency` to the `job_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."applications" DROP CONSTRAINT "applications_jobRequestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."applications" DROP CONSTRAINT "applications_workerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."job_requests" DROP CONSTRAINT "job_requests_statusId_fkey";

-- AlterTable
ALTER TABLE "public"."job_requests" DROP COLUMN "attachments",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "includesMaterials",
DROP COLUMN "qualification",
DROP COLUMN "requiresVisit",
DROP COLUMN "selectedApplicationId",
DROP COLUMN "startDate",
DROP COLUMN "statusId",
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "extraData" JSONB NOT NULL,
ADD COLUMN     "urgency" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "public"."applications";

-- DropTable
DROP TABLE "public"."job_request_statuses";
