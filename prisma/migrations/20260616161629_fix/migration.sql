/*
  Warnings:

  - Added the required column `numberOfQuestions` to the `QuestionBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionBank" ADD COLUMN     "numberOfQuestions" INTEGER NOT NULL;
