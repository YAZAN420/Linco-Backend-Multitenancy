-- CreateEnum
CREATE TYPE "DepartmentMemberRole" AS ENUM ('MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "DepartmentMember" ADD COLUMN     "role" "DepartmentMemberRole" NOT NULL DEFAULT 'MEMBER';
