/*
  Warnings:

  - You are about to drop the column `text` on the `QuestionChoice` table. All the data in the column will be lost.
  - Added the required column `choice` to the `QuestionChoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionChoice" DROP COLUMN "text",
ADD COLUMN     "choice" TEXT NOT NULL;
