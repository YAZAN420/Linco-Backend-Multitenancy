/*
  Warnings:

  - Added the required column `senderType` to the `InquiryReply` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InquirySenderType" AS ENUM ('ADMIN', 'SYSTEM', 'OWNER');

-- AlterTable
ALTER TABLE "InquiryReply" ADD COLUMN     "senderType" "InquirySenderType" NOT NULL;
