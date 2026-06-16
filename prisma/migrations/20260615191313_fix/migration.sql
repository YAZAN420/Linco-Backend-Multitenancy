/*
  Warnings:

  - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DepartmentCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[demoId,courseId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentId,courseId]` on the table `DepartmentCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `DepartmentCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DepartmentCourse" DROP CONSTRAINT "DepartmentCourse_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "DepartmentCourse_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_demoId_courseId_key" ON "Asset"("demoId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentCourse_departmentId_courseId_key" ON "DepartmentCourse"("departmentId", "courseId");
