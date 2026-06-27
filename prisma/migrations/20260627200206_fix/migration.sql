/*
  Warnings:

  - Added the required column `updatedAt` to the `DepartmentMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobTitle" AS ENUM ('INTERN', 'JUNIOR', 'SENIOR');

-- AlterTable
ALTER TABLE "DepartmentMember" ADD COLUMN     "jobTitle" "JobTitle" NOT NULL DEFAULT 'JUNIOR',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
