/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `ondefoi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ondefoi_pin_key" ON "ondefoi"("pin");
