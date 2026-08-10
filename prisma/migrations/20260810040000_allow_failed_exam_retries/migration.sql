-- DropIndex
DROP INDEX "ExamAttempt_demoMemberId_examId_key";

-- CreateIndex
CREATE INDEX "ExamAttempt_demoMemberId_examId_createdAt_idx"
ON "ExamAttempt"("demoMemberId", "examId", "createdAt");
