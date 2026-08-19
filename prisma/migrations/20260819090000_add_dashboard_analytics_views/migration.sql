-- Platform dashboard summary cards. Comparisons use the same rolling
-- 30-day baseline for every request so the API only has to format the data.
CREATE OR REPLACE VIEW "DashboardSummaryView" AS
WITH "Comparison" AS (
  SELECT
    (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '30 days' AS "at"
)
SELECT
  'dashboard-summary'::text AS "id",
  (
    SELECT COUNT(*)::int
    FROM "Demo"
  ) AS "registeredCompaniesCurrent",
  (
    SELECT COUNT(*)::int
    FROM "Demo" demo
    WHERE demo."createdAt" <= comparison."at"
  ) AS "registeredCompaniesPrevious",
  (
    SELECT COUNT(DISTINCT member."userId")::int
    FROM "DemoMember" member
    WHERE member."role" = 'MEMBER'::"DemoMemberRole"
  ) AS "activeLearnersCurrent",
  (
    SELECT COUNT(DISTINCT member."userId")::int
    FROM "DemoMember" member
    WHERE member."role" = 'MEMBER'::"DemoMemberRole"
      AND member."joinedAt" <= comparison."at"
  ) AS "activeLearnersPrevious",
  (
    SELECT COUNT(*)::int
    FROM "Course" course
    WHERE course."isPublished"
  ) AS "publishedCoursesCurrent",
  (
    SELECT COUNT(*)::int
    FROM "Course" course
    WHERE course."isPublished"
      AND course."createdAt" <= comparison."at"
  ) AS "publishedCoursesPrevious",
  (
    SELECT COUNT(DISTINCT member."userId")::int
    FROM "DemoMember" member
    WHERE member."role" = 'MEMBER'::"DemoMemberRole"
      AND EXISTS (
        SELECT 1
        FROM "Certification" certification
        WHERE certification."demoMemberId" = member."id"
      )
  ) AS "completedLearnersCurrent",
  (
    SELECT COUNT(DISTINCT member."userId")::int
    FROM "DemoMember" member
    WHERE member."role" = 'MEMBER'::"DemoMemberRole"
      AND EXISTS (
        SELECT 1
        FROM "Certification" certification
        WHERE certification."demoMemberId" = member."id"
          AND certification."issuedAt" <= comparison."at"
      )
  ) AS "completedLearnersPrevious"
FROM "Comparison" comparison;


-- Cumulative unique learner growth for each period supported by the UI.
-- A learner is counted once, from their first MEMBER workspace membership.
CREATE OR REPLACE VIEW "DashboardLearnerGrowthView" AS
WITH "Clock" AS (
  SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AS "now"
),
"Learners" AS (
  SELECT
    member."userId",
    MIN(member."joinedAt") AS "firstJoinedAt"
  FROM "DemoMember" member
  WHERE member."role" = 'MEMBER'::"DemoMemberRole"
  GROUP BY member."userId"
),
"Buckets" AS (
  SELECT
    '7D'::text AS "period",
    series."index"::int AS "bucketIndex",
    (
      DATE_TRUNC('day', clock."now")
      - MAKE_INTERVAL(days => 6 - series."index")
    )::timestamp(3) AS "date",
    CASE
      WHEN series."index" = 6 THEN clock."now"
      ELSE
        DATE_TRUNC('day', clock."now")
        - MAKE_INTERVAL(days => 6 - series."index")
        + INTERVAL '1 day'
        - INTERVAL '1 millisecond'
    END AS "bucketEnd"
  FROM "Clock" clock
  CROSS JOIN GENERATE_SERIES(0, 6) AS series("index")

  UNION ALL

  SELECT
    '6M'::text AS "period",
    series."index"::int AS "bucketIndex",
    (
      DATE_TRUNC('month', clock."now")
      - MAKE_INTERVAL(months => 5 - series."index")
    )::timestamp(3) AS "date",
    CASE
      WHEN series."index" = 5 THEN clock."now"
      ELSE
        DATE_TRUNC('month', clock."now")
        - MAKE_INTERVAL(months => 5 - series."index")
        + INTERVAL '1 month'
        - INTERVAL '1 millisecond'
    END AS "bucketEnd"
  FROM "Clock" clock
  CROSS JOIN GENERATE_SERIES(0, 5) AS series("index")

  UNION ALL

  SELECT
    '1Y'::text AS "period",
    series."index"::int AS "bucketIndex",
    (
      DATE_TRUNC('month', clock."now")
      - MAKE_INTERVAL(months => 11 - series."index")
    )::timestamp(3) AS "date",
    CASE
      WHEN series."index" = 11 THEN clock."now"
      ELSE
        DATE_TRUNC('month', clock."now")
        - MAKE_INTERVAL(months => 11 - series."index")
        + INTERVAL '1 month'
        - INTERVAL '1 millisecond'
    END AS "bucketEnd"
  FROM "Clock" clock
  CROSS JOIN GENERATE_SERIES(0, 11) AS series("index")
)
SELECT
  CONCAT(bucket."period", ':', bucket."bucketIndex")::text AS "id",
  bucket."period",
  bucket."bucketIndex",
  bucket."date",
  COUNT(learner."userId")::int AS "value"
FROM "Buckets" bucket
LEFT JOIN "Learners" learner
  ON learner."firstJoinedAt" <= bucket."bucketEnd"
GROUP BY
  bucket."period",
  bucket."bucketIndex",
  bucket."date";


-- Every user is assigned to exactly one dashboard category. Higher-privilege
-- workspace roles take precedence so the donut segments never overlap.
CREATE OR REPLACE VIEW "DashboardUserDistributionView" AS
WITH "UserCategories" AS (
  SELECT
    user_account."id" AS "userId",
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM "DemoMember" member
        WHERE member."userId" = user_account."id"
          AND member."role" = 'OWNER'::"DemoMemberRole"
      ) THEN 'OWNERS'::text
      WHEN EXISTS (
        SELECT 1
        FROM "DemoMember" member
        WHERE member."userId" = user_account."id"
          AND (
            member."role" = 'ADMIN'::"DemoMemberRole"
            OR EXISTS (
              SELECT 1
              FROM "DepartmentMember" department_member
              WHERE department_member."demoMemberId" = member."id"
                AND department_member."role" = 'MANAGER'::"DepartmentMemberRole"
            )
          )
      ) THEN 'MANAGERS'::text
      WHEN EXISTS (
        SELECT 1
        FROM "DemoMember" member
        WHERE member."userId" = user_account."id"
          AND member."role" = 'MEMBER'::"DemoMemberRole"
      ) THEN 'TRAINEES'::text
      ELSE 'OTHER_ROLES'::text
    END AS "role"
  FROM "User" user_account
),
"Categories"("role") AS (
  VALUES
    ('TRAINEES'::text),
    ('MANAGERS'::text),
    ('OWNERS'::text),
    ('OTHER_ROLES'::text)
),
"Counts" AS (
  SELECT
    user_category."role",
    COUNT(*)::int AS "count"
  FROM "UserCategories" user_category
  GROUP BY user_category."role"
),
"Total" AS (
  SELECT COUNT(*)::int AS "count"
  FROM "User"
)
SELECT
  category."role" AS "id",
  category."role",
  COALESCE(category_count."count", 0)::int AS "count",
  total."count" AS "total"
FROM "Categories" category
LEFT JOIN "Counts" category_count
  ON category_count."role" = category."role"
CROSS JOIN "Total" total;
