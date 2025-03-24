/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `ondefoi` table. All the data in the column will be lost.
  - Added the required column `surveyId` to the `ondefoi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ondefoi" DROP COLUMN "pessoaId",
ADD COLUMN     "surveyId" TEXT NOT NULL;
