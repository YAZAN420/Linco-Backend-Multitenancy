/*
  Warnings:

  - Made the column `currentPeriodEnd` on table `Demo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Demo" ALTER COLUMN "currentPeriodEnd" SET NOT NULL;
