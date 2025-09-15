/*
  Warnings:

  - Added the required column `statusId` to the `job_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."job_requests" ADD COLUMN     "statusId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."job_requests" ADD CONSTRAINT "job_requests_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
