-- AlterTable
ALTER TABLE "impacts" ALTER COLUMN "urgency" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "weeklyAvailability" DROP NOT NULL;
