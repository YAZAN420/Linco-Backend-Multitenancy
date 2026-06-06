/*
  Warnings:

  - The `role` column on the `DemoMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DemoMember" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'TRAINEE';

-- DropEnum
DROP TYPE "DemoRole";
