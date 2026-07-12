-- CreateTable
CREATE TABLE "CourseFaq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseFaq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseFaq_courseId_idx" ON "CourseFaq"("courseId");

-- AddForeignKey
ALTER TABLE "CourseFaq" ADD CONSTRAINT "CourseFaq_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
