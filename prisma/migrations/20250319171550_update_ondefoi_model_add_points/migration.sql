/*
  Warnings:

  - Added the required column `points` to the `ondefoi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ondefoi" ADD COLUMN     "points" INTEGER NOT NULL;
