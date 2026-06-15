/*
  Warnings:

  - You are about to drop the column `courseId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Lesson_courseId_idx";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "courseId";

-- CreateTable
CREATE TABLE "DemoInventory" (
    "demoId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "accessMethod" "AccessMethod" NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoInventory_pkey" PRIMARY KEY ("demoId","courseId")
);

-- CreateTable
CREATE TABLE "DepartmentCourse" (
    "departmentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentCourse_pkey" PRIMARY KEY ("departmentId","courseId")
);

-- AddForeignKey
ALTER TABLE "DemoInventory" ADD CONSTRAINT "DemoInventory_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoInventory" ADD CONSTRAINT "DemoInventory_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentCourse" ADD CONSTRAINT "DepartmentCourse_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentCourse" ADD CONSTRAINT "DepartmentCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
