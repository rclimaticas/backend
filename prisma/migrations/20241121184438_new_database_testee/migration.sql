/*
  Warnings:

  - The `affectedCommunity` column on the `impacts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "impacts" DROP COLUMN "affectedCommunity",
ADD COLUMN     "affectedCommunity" TEXT[];
