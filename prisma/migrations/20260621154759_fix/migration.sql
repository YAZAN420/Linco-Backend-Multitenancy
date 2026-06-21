/*
  Warnings:

  - You are about to drop the column `startedAt` on the `ExamAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `ExamAttempt` table. All the data in the column will be lost.
  - You are about to drop the `AttemptAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttemptAnswer" DROP CONSTRAINT "AttemptAnswer_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "AttemptAnswer" DROP CONSTRAINT "AttemptAnswer_choiceId_fkey";

-- DropForeignKey
ALTER TABLE "AttemptAnswer" DROP CONSTRAINT "AttemptAnswer_questionId_fkey";

-- AlterTable
ALTER TABLE "ExamAttempt" DROP COLUMN "startedAt",
DROP COLUMN "submittedAt";

-- DropTable
DROP TABLE "AttemptAnswer";
