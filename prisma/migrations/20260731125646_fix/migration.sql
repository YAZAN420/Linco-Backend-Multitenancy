/*
  Warnings:

  - You are about to drop the `InquiryMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InquiryMessage" DROP CONSTRAINT "InquiryMessage_inquiryId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryMessage" DROP CONSTRAINT "InquiryMessage_senderId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "InquiryMessage";

-- CreateTable
CREATE TABLE "InquiryReply" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InquiryReply_inquiryId_key" ON "InquiryReply"("inquiryId");

-- AddForeignKey
ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
