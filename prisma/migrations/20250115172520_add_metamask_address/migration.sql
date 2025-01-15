/*
  Warnings:

  - A unique constraint covering the columns `[metamaskAddress]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metamaskAddress` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "metamaskAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_metamaskAddress_key" ON "users"("metamaskAddress");
