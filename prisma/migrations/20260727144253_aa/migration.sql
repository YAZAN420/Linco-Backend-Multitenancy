/*
  Warnings:

  - You are about to drop the column `userId` on the `ExamAttempt` table. All the data in the column will be lost.
  - Added the required column `demoMemberId` to the `ExamAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExamAttempt" DROP CONSTRAINT "ExamAttempt_userId_fkey";

-- DropIndex
DROP INDEX "ExamAttempt_userId_examId_key";

-- AlterTable
ALTER TABLE "ExamAttempt" DROP COLUMN "userId",
ADD COLUMN     "demoMemberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_demoMemberId_fkey" FOREIGN KEY ("demoMemberId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
