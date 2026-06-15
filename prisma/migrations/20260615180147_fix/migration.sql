/*
  Warnings:

  - You are about to drop the `DemoInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DemoInventory" DROP CONSTRAINT "DemoInventory_courseId_fkey";

-- DropForeignKey
ALTER TABLE "DemoInventory" DROP CONSTRAINT "DemoInventory_demoId_fkey";

-- DropTable
DROP TABLE "DemoInventory";

-- CreateTable
CREATE TABLE "Asset" (
    "demoId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "accessMethod" "AccessMethod" NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("demoId","courseId")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
