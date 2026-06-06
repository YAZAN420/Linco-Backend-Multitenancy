/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepartmentPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DemoRole" AS ENUM ('TRAINEE', 'MANAGER');

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_demoId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentPermission" DROP CONSTRAINT "DepartmentPermission_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentPermission" DROP CONSTRAINT "DepartmentPermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentPermission" DROP CONSTRAINT "DepartmentPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_demoId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Marks" DROP CONSTRAINT "Marks_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Marks" DROP CONSTRAINT "Marks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToTag" DROP CONSTRAINT "_CourseToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToTag" DROP CONSTRAINT "_CourseToTag_B_fkey";

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "Certification";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "DepartmentPermission";

-- DropTable
DROP TABLE "FAQ";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "Marks";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_CourseToTag";

-- DropEnum
DROP TYPE "AttachmentType";

-- DropEnum
DROP TYPE "FeatureType";

-- CreateTable
CREATE TABLE "DemoMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "role" "DemoRole" NOT NULL DEFAULT 'TRAINEE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoMember_userId_demoId_key" ON "DemoMember"("userId", "demoId");

-- AddForeignKey
ALTER TABLE "DemoMember" ADD CONSTRAINT "DemoMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoMember" ADD CONSTRAINT "DemoMember_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
