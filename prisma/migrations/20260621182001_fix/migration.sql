/*
  Warnings:

  - You are about to drop the column `durationMiutes` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "durationMiutes",
ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 100000;
