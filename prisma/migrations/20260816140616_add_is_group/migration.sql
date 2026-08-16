/*
  Warnings:

  - The values [PENDING,CANCELED,PAST_DUE] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Design` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DesignAsset` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('TRIALING', 'EXPIRED', 'ACTIVE');
ALTER TABLE "public"."Demo" ALTER COLUMN "subscriptionStatus" DROP DEFAULT;
ALTER TABLE "Demo" ALTER COLUMN "subscriptionStatus" TYPE "SubscriptionStatus_new" USING ("subscriptionStatus"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "public"."SubscriptionStatus_old";
ALTER TABLE "Demo" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'TRIALING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Design" DROP CONSTRAINT "Design_currentAssetId_fkey";

-- DropForeignKey
ALTER TABLE "Design" DROP CONSTRAINT "Design_sourceAssetId_fkey";

-- DropForeignKey
ALTER TABLE "Design" DROP CONSTRAINT "Design_userId_fkey";

-- DropForeignKey
ALTER TABLE "DesignAsset" DROP CONSTRAINT "DesignAsset_designId_fkey";

-- DropForeignKey
ALTER TABLE "DesignAsset" DROP CONSTRAINT "DesignAsset_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "DesignAsset" DROP CONSTRAINT "DesignAsset_sourceAssetId_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Design";

-- DropTable
DROP TABLE "DesignAsset";
