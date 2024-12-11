/*
  Warnings:

  - You are about to drop the `People` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThemeBiome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PeopleToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ThemeBiomeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PeopleToUser" DROP CONSTRAINT "_PeopleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PeopleToUser" DROP CONSTRAINT "_PeopleToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ThemeBiomeToUser" DROP CONSTRAINT "_ThemeBiomeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ThemeBiomeToUser" DROP CONSTRAINT "_ThemeBiomeToUser_B_fkey";

-- AlterTable
ALTER TABLE "impacts" ALTER COLUMN "affectedCommunity" SET NOT NULL,
ALTER COLUMN "affectedCommunity" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "peoples" TEXT[],
ADD COLUMN     "themesBiomes" TEXT[];

-- DropTable
DROP TABLE "People";

-- DropTable
DROP TABLE "ThemeBiome";

-- DropTable
DROP TABLE "_PeopleToUser";

-- DropTable
DROP TABLE "_ThemeBiomeToUser";
