/*
  Warnings:

  - You are about to drop the column `points` on the `QuestionBank` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `QuestionBank` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestionBank" DROP COLUMN "points",
DROP COLUMN "sortOrder";
