/*
  Warnings:

  - You are about to drop the column `numOfQuestions` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `durationMiutes` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfQuestions` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "numOfQuestions",
ADD COLUMN     "durationMiutes" INTEGER NOT NULL,
ADD COLUMN     "numberOfQuestions" INTEGER NOT NULL;
