/*
  Warnings:

  - Changed the type of `workLocation` on the `workers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `workingDays` on the `workers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `workingHours` on the `workers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."workers" DROP COLUMN "workLocation",
ADD COLUMN     "workLocation" JSONB NOT NULL,
DROP COLUMN "workingDays",
ADD COLUMN     "workingDays" JSONB NOT NULL,
DROP COLUMN "workingHours",
ADD COLUMN     "workingHours" JSONB NOT NULL;
