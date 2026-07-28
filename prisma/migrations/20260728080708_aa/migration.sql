-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'AUDIO');

-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "durationMinutes" SET DEFAULT 60;

-- CreateTable
CREATE TABLE "DepartmentMessage" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT,
    "blobName" TEXT,
    "fileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "replyToId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DepartmentMessage_departmentId_createdAt_idx" ON "DepartmentMessage"("departmentId", "createdAt");

-- AddForeignKey
ALTER TABLE "DepartmentMessage" ADD CONSTRAINT "DepartmentMessage_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMessage" ADD CONSTRAINT "DepartmentMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "DepartmentMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMessage" ADD CONSTRAINT "DepartmentMessage_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "DepartmentMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
