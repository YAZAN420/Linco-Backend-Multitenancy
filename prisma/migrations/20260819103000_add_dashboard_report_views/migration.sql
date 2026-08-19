-- Monthly learning activity for the six-month engagement chart.
-- The application does not store page-view history, so active learners are
-- members with a measurable learning action (exam or discussion activity).
CREATE OR REPLACE VIEW "DashboardLearningEngagementView" AS
WITH "Clock" AS (
  SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AS "now"
),
"Months" AS (
  SELECT
    series."index"::int AS "bucketIndex",
    (
      DATE_TRUNC('month', clock."now")
      - MAKE_INTERVAL(months => 5 - series."index")
    )::timestamp(3) AS "date"
  FROM "Clock" clock
  CROSS JOIN GENERATE_SERIES(0, 5) AS series("index")
),
"LearningEvents" AS (
  SELECT attempt."demoMemberId", attempt."createdAt"
  FROM "ExamAttempt" attempt

  UNION ALL

  SELECT question."demoMemberId", question."createdAt"
  FROM "DiscussionQuestion" question

  UNION ALL

  SELECT answer."demoMemberId", answer."createdAt"
  FROM "DiscussionAnswer" answer
)
SELECT
  CONCAT('learning-engagement:', TO_CHAR(month."date", 'YYYY-MM'))::text AS "id",
  month."bucketIndex",
  month."date",
  (
    SELECT COUNT(DISTINCT learning_event."demoMemberId")::int
    FROM "LearningEvents" learning_event
    WHERE learning_event."createdAt" >= month."date"
      AND learning_event."createdAt" < month."date" + INTERVAL '1 month'
  ) AS "activeLearners",
  (
    SELECT COUNT(*)::int
    FROM "Certification" certification
    WHERE certification."issuedAt" >= month."date"
      AND certification."issuedAt" < month."date" + INTERVAL '1 month'
  ) AS "completedLearningPaths"
FROM "Months" month;


-- Current-month operational health that can be calculated from application
-- data. API availability stays nullable until request/uptime telemetry exists.
CREATE OR REPLACE VIEW "DashboardPlatformHealthView" AS
WITH "Clock" AS (
  SELECT
    (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AS "now",
    DATE_TRUNC(
      'month',
      CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    )::timestamp(3) AS "periodStart"
),
"CourseAssignments" AS (
  SELECT DISTINCT
    membership."demoMemberId",
    asset."courseId"
  FROM "DepartmentMember" membership
  INNER JOIN "DepartmentCourse" department_course
    ON department_course."departmentId" = membership."departmentId"
  INNER JOIN "Asset" asset
    ON asset."id" = department_course."assetId"
),
"CourseCompletion" AS (
  SELECT
    COUNT(*)::int AS "assignments",
    COUNT(*) FILTER (
      WHERE EXISTS (
        SELECT 1
        FROM "Certification" certification
        WHERE certification."demoMemberId" = assignment."demoMemberId"
          AND certification."courseId" = assignment."courseId"
      )
    )::int AS "completedAssignments"
  FROM "CourseAssignments" assignment
),
"WorkspaceActivation" AS (
  SELECT
    COUNT(*)::int AS "workspaces",
    COUNT(*) FILTER (
      WHERE demo."subscriptionStatus" IN (
        'ACTIVE'::"SubscriptionStatus",
        'TRIALING'::"SubscriptionStatus"
      )
        AND demo."currentPeriodEnd" >= clock."now"
    )::int AS "activatedWorkspaces"
  FROM "Demo" demo
  CROSS JOIN "Clock" clock
),
"SupportResponse" AS (
  SELECT
    COUNT(*)::int AS "inquiries",
    COUNT(*) FILTER (
      WHERE reply."createdAt" IS NOT NULL
        AND reply."createdAt" <= inquiry."createdAt" + INTERVAL '24 hours'
    )::int AS "responsesWithinSla"
  FROM "Inquiry" inquiry
  CROSS JOIN "Clock" clock
  LEFT JOIN "InquiryReply" reply
    ON reply."inquiryId" = inquiry."id"
  WHERE inquiry."createdAt" >= clock."periodStart"
    AND inquiry."createdAt" < clock."periodStart" + INTERVAL '1 month'
)
SELECT
  'platform-health'::text AS "id",
  clock."periodStart",
  NULL::float AS "apiAvailability",
  CASE
    WHEN course_completion."assignments" = 0 THEN 0::float
    ELSE ROUND(
      course_completion."completedAssignments"::numeric
      / course_completion."assignments"::numeric * 100,
      1
    )::float
  END AS "courseCompletion",
  CASE
    WHEN workspace_activation."workspaces" = 0 THEN 0::float
    ELSE ROUND(
      workspace_activation."activatedWorkspaces"::numeric
      / workspace_activation."workspaces"::numeric * 100,
      1
    )::float
  END AS "workspaceActivation",
  CASE
    WHEN support_response."inquiries" = 0 THEN 0::float
    ELSE ROUND(
      support_response."responsesWithinSla"::numeric
      / support_response."inquiries"::numeric * 100,
      1
    )::float
  END AS "supportResponseSla",
  course_completion."assignments" AS "courseAssignments",
  course_completion."completedAssignments" AS "completedCourseAssignments",
  workspace_activation."workspaces" AS "totalWorkspaces",
  workspace_activation."activatedWorkspaces" AS "activatedWorkspaces",
  support_response."inquiries" AS "supportInquiries",
  support_response."responsesWithinSla" AS "supportResponsesWithinSla"
FROM "Clock" clock
CROSS JOIN "CourseCompletion" course_completion
CROSS JOIN "WorkspaceActivation" workspace_activation
CROSS JOIN "SupportResponse" support_response;
