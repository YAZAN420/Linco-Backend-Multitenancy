-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_demoId_fkey";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
