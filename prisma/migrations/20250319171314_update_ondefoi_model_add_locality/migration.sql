/*
  Warnings:

  - Added the required column `locality` to the `ondefoi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ondefoi" ADD COLUMN     "locality" TEXT NOT NULL;
