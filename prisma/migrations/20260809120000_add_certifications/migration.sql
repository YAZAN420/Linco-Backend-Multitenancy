-- AlterTable
ALTER TABLE "Exam" ADD COLUMN "passingScore" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "demoMemberId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExamAttempt_demoMemberId_examId_key" ON "ExamAttempt"("demoMemberId", "examId");
CREATE INDEX "ExamAttempt_examId_idx" ON "ExamAttempt"("examId");
CREATE UNIQUE INDEX "Certification_courseId_demoMemberId_key" ON "Certification"("courseId", "demoMemberId");
CREATE INDEX "Certification_courseId_idx" ON "Certification"("courseId");
CREATE INDEX "Certification_demoMemberId_idx" ON "Certification"("demoMemberId");

ALTER TABLE "Certification" ADD CONSTRAINT "Certification_demoMemberId_fkey" FOREIGN KEY ("demoMemberId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
