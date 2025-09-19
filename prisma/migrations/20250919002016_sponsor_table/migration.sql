/*
  Warnings:

  - You are about to drop the column `name` on the `sponsors` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `sponsors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alternativeEmail]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alternativeEmail` to the `sponsors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyRegistration` to the `sponsors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `sponsors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuilId` to the `sponsors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `sponsors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeName` to the `sponsors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."sponsors" DROP COLUMN "name",
DROP COLUMN "taxId",
ADD COLUMN     "aditionalInformation" TEXT,
ADD COLUMN     "alternativeEmail" VARCHAR(80) NOT NULL,
ADD COLUMN     "companyRegistration" TEXT NOT NULL,
ADD COLUMN     "contactName" VARCHAR(70) NOT NULL,
ADD COLUMN     "cuilId" INTEGER NOT NULL,
ADD COLUMN     "email" VARCHAR(80) NOT NULL,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "social" JSONB,
ADD COLUMN     "tradeName" VARCHAR(45) NOT NULL,
ADD COLUMN     "workingDays" JSONB,
ADD COLUMN     "workingHours" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_email_key" ON "public"."sponsors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_alternativeEmail_key" ON "public"."sponsors"("alternativeEmail");
