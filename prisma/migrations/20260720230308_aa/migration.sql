-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryMessage" DROP CONSTRAINT "InquiryMessage_senderId_fkey";

-- CreateIndex
CREATE INDEX "Inquiry_demoId_idx" ON "Inquiry"("demoId");

-- CreateIndex
CREATE INDEX "Inquiry_creatorId_idx" ON "Inquiry"("creatorId");

-- CreateIndex
CREATE INDEX "InquiryMessage_inquiryId_idx" ON "InquiryMessage"("inquiryId");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryMessage" ADD CONSTRAINT "InquiryMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
