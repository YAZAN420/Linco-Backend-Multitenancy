/*
  Warnings:

  - Added the required column `updatedAt` to the `DemoInventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DepartmentCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DemoInventory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DepartmentCourse" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
