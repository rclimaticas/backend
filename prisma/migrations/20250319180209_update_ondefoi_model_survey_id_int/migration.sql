/*
  Warnings:

  - Changed the type of `surveyId` on the `ondefoi` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ondefoi" DROP COLUMN "surveyId",
ADD COLUMN     "surveyId" INTEGER NOT NULL;
