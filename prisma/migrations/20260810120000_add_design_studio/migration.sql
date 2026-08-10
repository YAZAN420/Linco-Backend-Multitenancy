CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceAssetId" TEXT,
    "currentAssetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DesignAsset" (
    "id" TEXT NOT NULL,
    "designId" TEXT,
    "ownerId" TEXT NOT NULL,
    "sourceAssetId" TEXT,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DesignAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DesignAsset_fileKey_key" ON "DesignAsset"("fileKey");
CREATE INDEX "Design_userId_createdAt_idx" ON "Design"("userId", "createdAt");
CREATE INDEX "Design_sourceAssetId_idx" ON "Design"("sourceAssetId");
CREATE INDEX "Design_currentAssetId_idx" ON "Design"("currentAssetId");
CREATE INDEX "DesignAsset_designId_createdAt_idx" ON "DesignAsset"("designId", "createdAt");
CREATE INDEX "DesignAsset_ownerId_idx" ON "DesignAsset"("ownerId");
CREATE INDEX "DesignAsset_sourceAssetId_idx" ON "DesignAsset"("sourceAssetId");
ALTER TABLE "Design" ADD CONSTRAINT "Design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DesignAsset" ADD CONSTRAINT "DesignAsset_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DesignAsset" ADD CONSTRAINT "DesignAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DesignAsset" ADD CONSTRAINT "DesignAsset_sourceAssetId_fkey" FOREIGN KEY ("sourceAssetId") REFERENCES "DesignAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Design" ADD CONSTRAINT "Design_sourceAssetId_fkey" FOREIGN KEY ("sourceAssetId") REFERENCES "DesignAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Design" ADD CONSTRAINT "Design_currentAssetId_fkey" FOREIGN KEY ("currentAssetId") REFERENCES "DesignAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
