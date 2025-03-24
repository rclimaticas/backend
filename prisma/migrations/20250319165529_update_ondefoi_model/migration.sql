/*
  Warnings:

  - Added the required column `pessoaId` to the `ondefoi` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pin` on the `ondefoi` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ondefoi" ADD COLUMN     "pessoaId" TEXT NOT NULL,
DROP COLUMN "pin",
ADD COLUMN     "pin" INTEGER NOT NULL;
