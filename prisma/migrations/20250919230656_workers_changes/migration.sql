/*
  Warnings:

  - You are about to drop the column `availability` on the `workers` table. All the data in the column will be lost.
  - Added the required column `subtitle` to the `workers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingDays` to the `workers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHours` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."workers" DROP COLUMN "availability",
ADD COLUMN     "subtitle" VARCHAR(100) NOT NULL,
ADD COLUMN     "workingDays" VARCHAR(100) NOT NULL,
ADD COLUMN     "workingHours" VARCHAR(100) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);
