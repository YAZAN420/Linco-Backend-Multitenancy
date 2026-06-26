/*
  Warnings:

  - You are about to drop the column `authorDemoId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `demoId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_authorDemoId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "authorDemoId",
ADD COLUMN     "demoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
