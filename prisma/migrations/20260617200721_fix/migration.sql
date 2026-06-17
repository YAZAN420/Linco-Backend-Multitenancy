-- CreateTable
CREATE TABLE "DiscussionQuestion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "demoMemberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionAnswer" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "demoMemberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionQuestion_lessonId_idx" ON "DiscussionQuestion"("lessonId");

-- CreateIndex
CREATE INDEX "DiscussionAnswer_discussionId_idx" ON "DiscussionAnswer"("discussionId");

-- AddForeignKey
ALTER TABLE "DiscussionQuestion" ADD CONSTRAINT "DiscussionQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionQuestion" ADD CONSTRAINT "DiscussionQuestion_demoMemberId_fkey" FOREIGN KEY ("demoMemberId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "DiscussionQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionAnswer" ADD CONSTRAINT "DiscussionAnswer_demoMemberId_fkey" FOREIGN KEY ("demoMemberId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
