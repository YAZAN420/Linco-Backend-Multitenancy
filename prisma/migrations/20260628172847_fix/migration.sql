-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'PRO', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Demo" ADD COLUMN     "plan" "PlanTier" NOT NULL DEFAULT 'STARTER';
