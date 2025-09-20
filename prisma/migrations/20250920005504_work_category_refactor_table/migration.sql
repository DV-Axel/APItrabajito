/*
  Warnings:

  - You are about to drop the column `baseRate` on the `worker_categories` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `worker_categories` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `worker_categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."worker_categories" DROP COLUMN "baseRate",
DROP COLUMN "experienceLevel",
DROP COLUMN "isPrimary",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
