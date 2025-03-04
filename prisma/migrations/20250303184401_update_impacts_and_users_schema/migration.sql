/*
  Warnings:

  - Changed the type of `urgency` on the `impacts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `weeklyAvailability` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "impacts" DROP COLUMN "urgency",
ADD COLUMN     "urgency" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "weeklyAvailability",
ADD COLUMN     "weeklyAvailability" INTEGER NOT NULL;
