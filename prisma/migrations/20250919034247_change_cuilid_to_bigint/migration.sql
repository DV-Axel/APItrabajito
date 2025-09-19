/*
  Warnings:

  - Changed the type of `serviceKey` on the `job_requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."job_requests" DROP COLUMN "serviceKey",
ADD COLUMN     "serviceKey" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."sponsors" ALTER COLUMN "cuilId" SET DATA TYPE BIGINT;
