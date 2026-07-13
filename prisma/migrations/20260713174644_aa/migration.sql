/*
  Warnings:

  - The values [MANAGER,TRAINER] on the enum `DemoMemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DemoMemberRole_new" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
ALTER TABLE "public"."DemoMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Invitation" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "DemoMember" ALTER COLUMN "role" TYPE "DemoMemberRole_new" USING ("role"::text::"DemoMemberRole_new");
ALTER TABLE "Invitation" ALTER COLUMN "role" TYPE "DemoMemberRole_new" USING ("role"::text::"DemoMemberRole_new");
ALTER TYPE "DemoMemberRole" RENAME TO "DemoMemberRole_old";
ALTER TYPE "DemoMemberRole_new" RENAME TO "DemoMemberRole";
DROP TYPE "public"."DemoMemberRole_old";
ALTER TABLE "DemoMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
ALTER TABLE "Invitation" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "DemoMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
