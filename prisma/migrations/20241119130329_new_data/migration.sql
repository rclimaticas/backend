/*
  Warnings:

  - The `affectedCommunity` column on the `impacts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `peoples` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `themesBiomes` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "impacts" DROP COLUMN "affectedCommunity",
ADD COLUMN     "affectedCommunity" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "peoples",
DROP COLUMN "themesBiomes";

-- CreateTable
CREATE TABLE "ThemeBiome" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ThemeBiome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "People" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "People_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ThemeBiomeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PeopleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemeBiome_name_key" ON "ThemeBiome"("name");

-- CreateIndex
CREATE UNIQUE INDEX "People_name_key" ON "People"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ThemeBiomeToUser_AB_unique" ON "_ThemeBiomeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ThemeBiomeToUser_B_index" ON "_ThemeBiomeToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PeopleToUser_AB_unique" ON "_PeopleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PeopleToUser_B_index" ON "_PeopleToUser"("B");

-- AddForeignKey
ALTER TABLE "_ThemeBiomeToUser" ADD CONSTRAINT "_ThemeBiomeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ThemeBiome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThemeBiomeToUser" ADD CONSTRAINT "_ThemeBiomeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeopleToUser" ADD CONSTRAINT "_PeopleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "People"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeopleToUser" ADD CONSTRAINT "_PeopleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
