-- CreateTable
CREATE TABLE "impactsValidated" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "support" TEXT NOT NULL,
    "affectedCommunity" TEXT[],
    "biomes" TEXT[],
    "situation" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "impactsValidated_pkey" PRIMARY KEY ("id")
);
