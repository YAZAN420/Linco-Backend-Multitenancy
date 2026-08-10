-- AlterTable
ALTER TABLE "Course"
ADD COLUMN "signatureImagePath" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Certification"
ADD COLUMN "issuedAt" TIMESTAMP(3);

UPDATE "Certification"
SET "issuedAt" = "createdAt";

ALTER TABLE "Certification"
ALTER COLUMN "issuedAt" SET NOT NULL,
ALTER COLUMN "issuedAt" SET DEFAULT CURRENT_TIMESTAMP;
