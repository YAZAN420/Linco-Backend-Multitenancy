CREATE INDEX "DemoMember_demoId_joinedAt_id_idx"
ON "DemoMember"("demoId", "joinedAt", "id");

CREATE INDEX "DemoMember_role_joinedAt_userId_idx"
ON "DemoMember"("role", "joinedAt", "userId");

CREATE INDEX "DepartmentMember_role_demoMemberId_idx"
ON "DepartmentMember"("role", "demoMemberId");

CREATE INDEX "Demo_createdAt_id_idx"
ON "Demo"("createdAt", "id");

CREATE INDEX "Course_isPublished_createdAt_id_idx"
ON "Course"("isPublished", "createdAt", "id");

CREATE INDEX "Course_isPublished_updatedAt_id_idx"
ON "Course"("isPublished", "updatedAt", "id");

CREATE INDEX "Payment_type_status_updatedAt_id_idx"
ON "Payment"("type", "status", "updatedAt", "id");

CREATE INDEX "Certification_issuedAt_demoMemberId_idx"
ON "Certification"("issuedAt", "demoMemberId");
