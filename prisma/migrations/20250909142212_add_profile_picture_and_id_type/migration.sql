/*
  Warnings:

  - Added the required column `idType` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "idType" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL;
