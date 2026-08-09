-- CreateEnum
CREATE TYPE "LiveStreamStatus" AS ENUM ('SCHEDULED', 'LIVE', 'ENDED');

-- CreateTable
CREATE TABLE "LiveStream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "LiveStreamStatus" NOT NULL DEFAULT 'SCHEDULED',
    "roomName" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LiveStream_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LiveStream_roomName_key" ON "LiveStream"("roomName");
CREATE INDEX "LiveStream_departmentId_status_idx" ON "LiveStream"("departmentId", "status");
CREATE INDEX "LiveStream_hostId_idx" ON "LiveStream"("hostId");

ALTER TABLE "LiveStream" ADD CONSTRAINT "LiveStream_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LiveStream" ADD CONSTRAINT "LiveStream_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "DepartmentMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
