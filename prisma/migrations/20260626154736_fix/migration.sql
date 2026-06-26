/*
  Warnings:

  - Added the required column `description` to the `Demo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `Demo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Demo" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imagePath" TEXT NOT NULL;
