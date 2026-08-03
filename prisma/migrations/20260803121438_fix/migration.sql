/*
  Warnings:

  - Added the required column `note` to the `QuestionsBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionsBank" ADD COLUMN     "note" TEXT NOT NULL;
