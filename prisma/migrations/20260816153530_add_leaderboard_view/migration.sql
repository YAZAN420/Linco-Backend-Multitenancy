DROP VIEW IF EXISTS "DepartmentLeaderboard";

CREATE VIEW "DepartmentLeaderboard" AS
WITH BestExamScores AS (
  SELECT 
    ea."demoMemberId",
    ea."examId",
    dc."departmentId",
    MAX(ea."score") AS best_score
  FROM "ExamAttempt" ea
  INNER JOIN "Exam" e ON ea."examId" = e."id"
  INNER JOIN "Section" s ON e."sectionId" = s."id"
  INNER JOIN "Asset" a ON s."courseId" = a."courseId"
  INNER JOIN "DepartmentCourse" dc ON a."id" = dc."assetId"
  GROUP BY ea."demoMemberId", ea."examId", dc."departmentId"
),
MemberScores AS (
  SELECT 
    CONCAT(dep_m."departmentId", '_', u."id") AS "id",
    dep_m."departmentId",
    u."id" AS "userId",
    dep_m."id" AS "memberId",
    u."firstName",
    u."lastName",
    u."imagePath",
    dep_m."jobTitle",
    COALESCE(SUM(bes.best_score), 0)::INT AS "totalScore"
  FROM "DepartmentMember" dep_m
  INNER JOIN "DemoMember" dm ON dep_m."demoMemberId" = dm."id"
  INNER JOIN "User" u ON dm."userId" = u."id"
  LEFT JOIN BestExamScores bes 
    ON dm."id" = bes."demoMemberId" 
    AND dep_m."departmentId" = bes."departmentId"
  GROUP BY dep_m."departmentId", dep_m."id", u."id", u."firstName", u."lastName", u."imagePath", dep_m."jobTitle"
)
SELECT 
  "id",
  "departmentId",
  "userId",
  "memberId",
  "firstName",
  "lastName",
  "imagePath",
  "jobTitle",
  "totalScore",
  DENSE_RANK() OVER (
    PARTITION BY "departmentId" 
    ORDER BY "totalScore" DESC, "firstName" ASC
  )::INT AS "rank"
FROM MemberScores;