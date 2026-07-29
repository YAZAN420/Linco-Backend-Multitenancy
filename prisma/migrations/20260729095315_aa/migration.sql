/*
  Warnings:

  - You are about to drop the column `blobName` on the `DepartmentMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DepartmentMessage" DROP COLUMN "blobName",
ADD COLUMN     "fileUrl" TEXT;
