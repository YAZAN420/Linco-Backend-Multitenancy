-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'CANCELED';

-- CreateIndex
CREATE INDEX "Asset_demoId_acquiredAt_id_idx" ON "Asset"("demoId", "acquiredAt", "id");

-- CreateIndex
CREATE INDEX "Course_demoId_isPublished_createdAt_id_idx" ON "Course"("demoId", "isPublished", "createdAt", "id");

-- CreateIndex
CREATE INDEX "Course_demoId_createdAt_id_idx" ON "Course"("demoId", "createdAt", "id");

-- CreateIndex
CREATE INDEX "Demo_ownerId_idx" ON "Demo"("ownerId");

-- CreateIndex
CREATE INDEX "Demo_subscriptionStatus_currentPeriodEnd_idx" ON "Demo"("subscriptionStatus", "currentPeriodEnd");

-- CreateIndex
CREATE INDEX "Department_demoId_createdAt_id_idx" ON "Department"("demoId", "createdAt", "id");

-- CreateIndex
CREATE INDEX "DepartmentCourse_departmentId_idx" ON "DepartmentCourse"("departmentId");

-- CreateIndex
CREATE INDEX "DepartmentCourse_assetId_idx" ON "DepartmentCourse"("assetId");

-- CreateIndex
CREATE INDEX "DepartmentMessage_senderId_idx" ON "DepartmentMessage"("senderId");

-- CreateIndex
CREATE INDEX "DiscussionAnswer_demoMemberId_idx" ON "DiscussionAnswer"("demoMemberId");

-- CreateIndex
CREATE INDEX "DiscussionQuestion_demoMemberId_lessonId_idx" ON "DiscussionQuestion"("demoMemberId", "lessonId");

-- CreateIndex
CREATE INDEX "InquiryReply_senderId_idx" ON "InquiryReply"("senderId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "QuestionChoice_questionId_idx" ON "QuestionChoice"("questionId");

-- CreateIndex
CREATE INDEX "QuestionsBank_sectionId_idx" ON "QuestionsBank"("sectionId");

-- CreateIndex
CREATE INDEX "User_role_status_createdAt_id_idx" ON "User"("role", "status", "createdAt", "id");

-- CreateIndex
CREATE INDEX "User_emailVerificationToken_idx" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE INDEX "User_passwordResetToken_idx" ON "User"("passwordResetToken");
