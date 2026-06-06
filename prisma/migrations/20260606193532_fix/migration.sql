/*
  Warnings:

  - The `role` column on the `DemoMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `DemoMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DemoRole" AS ENUM ('TRAINER', 'MANAGER');

-- AlterTable
ALTER TABLE "DemoMember" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "DemoRole" NOT NULL DEFAULT 'TRAINER';
