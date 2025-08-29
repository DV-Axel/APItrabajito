/*
  Warnings:

  - Added the required column `number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "number" VARCHAR(10) NOT NULL,
ADD COLUMN     "postalCode" VARCHAR(10) NOT NULL;
