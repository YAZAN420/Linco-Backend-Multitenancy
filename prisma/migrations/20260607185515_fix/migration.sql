-- CreateEnum
CREATE TYPE "CourseVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AccessMethod" AS ENUM ('CREATED', 'PURCHASED');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" "CourseVisibility" NOT NULL DEFAULT 'PRIVATE',
    "price" DOUBLE PRECISION,
    "authorDemoId" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_authorDemoId_fkey" FOREIGN KEY ("authorDemoId") REFERENCES "Demo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
