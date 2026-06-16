/*
  Warnings:

  - You are about to drop the column `subtitleUrl` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sectionId,order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionId,title]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,title]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "subtitleUrl",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "subTitleUrl" TEXT;

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_sectionId_order_key" ON "Lesson"("sectionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_sectionId_title_key" ON "Lesson"("sectionId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Section_courseId_title_key" ON "Section"("courseId", "title");
