/*
  Warnings:

  - You are about to drop the column `courseId` on the `DepartmentCourse` table. All the data in the column will be lost.
  - You are about to drop the `QuestionBank` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[departmentId,assetId]` on the table `DepartmentCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `DepartmentCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttemptAnswer" DROP CONSTRAINT "AttemptAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentCourse" DROP CONSTRAINT "DepartmentCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionBank" DROP CONSTRAINT "QuestionBank_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_questionId_fkey";

-- DropIndex
DROP INDEX "DepartmentCourse_departmentId_courseId_key";

-- AlterTable
ALTER TABLE "DepartmentCourse" DROP COLUMN "courseId",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- DropTable
DROP TABLE "QuestionBank";

-- CreateTable
CREATE TABLE "QuestionsBank" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionsBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentCourse_departmentId_assetId_key" ON "DepartmentCourse"("departmentId", "assetId");

-- AddForeignKey
ALTER TABLE "QuestionsBank" ADD CONSTRAINT "QuestionsBank_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionChoice" ADD CONSTRAINT "QuestionChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionsBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionsBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentCourse" ADD CONSTRAINT "DepartmentCourse_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
