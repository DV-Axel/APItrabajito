/*
  Warnings:

  - You are about to alter the column `budget` on the `applications` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `finalBudget` on the `job_requests` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "budget" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "job_requests" ALTER COLUMN "finalBudget" SET DATA TYPE DECIMAL(10,2);
