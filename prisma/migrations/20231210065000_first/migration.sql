-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "subscriptions" TEXT[],
    "time" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
