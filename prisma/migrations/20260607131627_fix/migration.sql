/*
  Warnings:

  - The `role` column on the `DemoMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DemoMemberRole" AS ENUM ('TRAINER', 'MANAGER');

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_managerId_fkey";

-- AlterTable
ALTER TABLE "DemoMember" DROP COLUMN "role",
ADD COLUMN     "role" "DemoMemberRole" NOT NULL DEFAULT 'TRAINER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "DemoRole";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "DemoMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
