/*
  Warnings:

  - Added the required column `updatedAt` to the `InquiryMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InquiryMessage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
