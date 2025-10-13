/*
  Warnings:

  - A unique constraint covering the columns `[cuilId]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sponsors_cuilId_key" ON "sponsors"("cuilId");
