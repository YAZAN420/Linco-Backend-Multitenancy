-- FLOOR(value * 100 + 0.5) / 100 preserves the previous JavaScript
-- Math.round(value * 100) / 100 behavior while returning PostgreSQL floats.
CREATE OR REPLACE VIEW "DemoOwnerReportView" AS
WITH "DemoReport" AS (
  SELECT
    d."id" AS "demoId",
    COALESCE(member_stats."totalMembers", 0)::int AS "totalMembers",
    COALESCE(department_stats."totalDepartments", 0)::int AS "totalDepartments",
    COALESCE(course_stats."totalCourses", 0)::int AS "totalCourses",
    COALESCE(course_stats."publishedCourses", 0)::int AS "publishedCourses",
    COALESCE(certification_stats."totalCertifications", 0)::int AS "totalCertifications",
    CASE
      WHEN COALESCE(assignment_stats."assignmentCount", 0) = 0 THEN 0::float
      ELSE FLOOR(
        (
          certification_stats."totalCertifications"::float
          / assignment_stats."assignmentCount"::float * 100::float
        ) * 100::float + 0.5::float
      )::float / 100::float
    END AS "certificationRate",
    COALESCE(attempt_stats."totalExamAttempts", 0)::int AS "totalExamAttempts",
    CASE
      WHEN COALESCE(attempt_stats."totalExamAttempts", 0) = 0 THEN 0::float
      ELSE FLOOR(
        (
          attempt_stats."passedAttempts"::float
          / attempt_stats."totalExamAttempts"::float * 100::float
        ) * 100::float + 0.5::float
      )::float / 100::float
    END AS "examPassRate",
    COALESCE(attempt_stats."averageExamScore", 0::float)::float AS "averageExamScore"
  FROM "Demo" d
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS "totalMembers"
    FROM "DemoMember" dm
    WHERE dm."demoId" = d."id"
  ) member_stats ON TRUE
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS "totalDepartments"
    FROM "Department" department
    WHERE department."demoId" = d."id"
  ) department_stats ON TRUE
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*)::int AS "totalCourses",
      COUNT(*) FILTER (WHERE course."isPublished")::int AS "publishedCourses"
    FROM "Course" course
    WHERE course."demoId" = d."id"
  ) course_stats ON TRUE
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS "totalCertifications"
    FROM "Certification" certification
    INNER JOIN "DemoMember" dm
      ON dm."id" = certification."demoMemberId"
    WHERE dm."demoId" = d."id"
  ) certification_stats ON TRUE
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS "assignmentCount"
    FROM (
      SELECT DISTINCT
        membership."demoMemberId",
        asset."courseId"
      FROM "Department" department
      INNER JOIN "DepartmentMember" membership
        ON membership."departmentId" = department."id"
      INNER JOIN "DepartmentCourse" assignment
        ON assignment."departmentId" = department."id"
      INNER JOIN "Asset" asset
        ON asset."id" = assignment."assetId"
      WHERE department."demoId" = d."id"
    ) assigned_member_courses
  ) assignment_stats ON TRUE
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*)::int AS "totalExamAttempts",
      COUNT(*) FILTER (
        WHERE attempt."score" >= exam."passingScore"
      )::int AS "passedAttempts",
      COALESCE(
        FLOOR(
          AVG(attempt."score")::float * 100::float + 0.5::float
        )::float / 100::float,
        0::float
      ) AS "averageExamScore"
    FROM "ExamAttempt" attempt
    INNER JOIN "DemoMember" dm
      ON dm."id" = attempt."demoMemberId"
    INNER JOIN "Exam" exam
      ON exam."id" = attempt."examId"
    WHERE dm."demoId" = d."id"
  ) attempt_stats ON TRUE
)
SELECT
  CONCAT('summary:', report."demoId")::text AS "id",
  report."demoId",
  NULL::text AS "memberId",
  NULL::timestamp(3) AS "memberJoinedAt",
  report."totalMembers",
  report."totalDepartments",
  report."totalCourses",
  report."publishedCourses",
  report."totalCertifications",
  report."certificationRate",
  report."totalExamAttempts",
  report."examPassRate",
  report."averageExamScore"
FROM "DemoReport" report

UNION ALL

-- Event rows keep arbitrary report date ranges filterable. The repository
-- counts them in PostgreSQL while reading lifetime metrics from the summary row.
SELECT
  CONCAT('member:', dm."id")::text AS "id",
  dm."demoId",
  dm."id" AS "memberId",
  dm."joinedAt" AS "memberJoinedAt",
  0::int AS "totalMembers",
  0::int AS "totalDepartments",
  0::int AS "totalCourses",
  0::int AS "publishedCourses",
  0::int AS "totalCertifications",
  0::float AS "certificationRate",
  0::int AS "totalExamAttempts",
  0::float AS "examPassRate",
  0::float AS "averageExamScore"
FROM "DemoMember" dm;


CREATE OR REPLACE VIEW "MemberPerformanceView" AS
SELECT
  dm."id" AS "memberId",
  dm."demoId",
  dm."userId",
  BTRIM(CONCAT(user_account."firstName", ' ', user_account."lastName")) AS "fullName",
  user_account."email",
  dm."role" AS "demoRole",
  dm."joinedAt",
  COALESCE(
    department_stats."departmentIds",
    ARRAY[]::text[]
  ) AS "departmentIds",
  COALESCE(
    department_stats."departmentNames",
    ARRAY[]::text[]
  ) AS "departmentNames",
  COALESCE(
    department_stats."departmentRoles",
    ARRAY[]::"DepartmentMemberRole"[]
  ) AS "departmentRoles",
  COALESCE(
    department_stats."jobTitles",
    ARRAY[]::"JobTitle"[]
  ) AS "jobTitles",
  COALESCE(assignment_stats."assignedCourses", 0)::int AS "assignedCourses",
  COALESCE(attempt_stats."examAttempts", 0)::int AS "examAttempts",
  COALESCE(attempt_stats."examsPassed", 0)::int AS "examsPassed",
  (
    COALESCE(attempt_stats."examAttempts", 0)
    - COALESCE(attempt_stats."examsPassed", 0)
  )::int AS "examsFailed",
  COALESCE(attempt_stats."averageScore", 0::float)::float AS "averageScore",
  COALESCE(attempt_stats."highestScore", 0)::int AS "highestScore",
  COALESCE(activity_stats."certificationsEarned", 0)::int AS "certificationsEarned",
  COALESCE(activity_stats."discussionQuestionsCount", 0)::int AS "discussionQuestionsCount",
  COALESCE(activity_stats."discussionAnswersCount", 0)::int AS "discussionAnswersCount",
  COALESCE(activity_stats."messagesCount", 0)::int AS "messagesCount",
  COALESCE(activity_stats."inquiriesCount", 0)::int AS "inquiriesCount"
FROM "DemoMember" dm
INNER JOIN "User" user_account
  ON user_account."id" = dm."userId"
LEFT JOIN LATERAL (
  SELECT
    ARRAY_AGG(
      department."id"
      ORDER BY membership."id"
    ) AS "departmentIds",
    ARRAY_AGG(
      department."name"
      ORDER BY membership."id"
    ) AS "departmentNames",
    ARRAY_AGG(
      DISTINCT membership."role"
      ORDER BY membership."role"
    ) AS "departmentRoles",
    ARRAY_AGG(
      DISTINCT membership."jobTitle"
      ORDER BY membership."jobTitle"
    ) AS "jobTitles"
  FROM "DepartmentMember" membership
  INNER JOIN "Department" department
    ON department."id" = membership."departmentId"
  WHERE membership."demoMemberId" = dm."id"
) department_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(DISTINCT asset."courseId")::int AS "assignedCourses"
  FROM "DepartmentMember" membership
  INNER JOIN "DepartmentCourse" assignment
    ON assignment."departmentId" = membership."departmentId"
  INNER JOIN "Asset" asset
    ON asset."id" = assignment."assetId"
  WHERE membership."demoMemberId" = dm."id"
) assignment_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(*)::int AS "examAttempts",
    COUNT(*) FILTER (
      WHERE attempt."score" >= exam."passingScore"
    )::int AS "examsPassed",
    COALESCE(
      FLOOR(
        AVG(attempt."score")::float * 100::float + 0.5::float
      )::float / 100::float,
      0::float
    ) AS "averageScore",
    COALESCE(MAX(attempt."score"), 0)::int AS "highestScore"
  FROM "ExamAttempt" attempt
  INNER JOIN "Exam" exam
    ON exam."id" = attempt."examId"
  WHERE attempt."demoMemberId" = dm."id"
) attempt_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    (
      SELECT COUNT(*)::int
      FROM "Certification" certification
      WHERE certification."demoMemberId" = dm."id"
    ) AS "certificationsEarned",
    (
      SELECT COUNT(*)::int
      FROM "DiscussionQuestion" question
      WHERE question."demoMemberId" = dm."id"
    ) AS "discussionQuestionsCount",
    (
      SELECT COUNT(*)::int
      FROM "DiscussionAnswer" answer
      WHERE answer."demoMemberId" = dm."id"
    ) AS "discussionAnswersCount",
    (
      SELECT COUNT(*)::int
      FROM "DepartmentMember" membership
      INNER JOIN "DepartmentMessage" message
        ON message."senderId" = membership."id"
       AND NOT message."isDeleted"
      WHERE membership."demoMemberId" = dm."id"
    ) AS "messagesCount",
    (
      SELECT COUNT(*)::int
      FROM "Inquiry" inquiry
      WHERE inquiry."creatorId" = dm."id"
    ) AS "inquiriesCount"
) activity_stats ON TRUE;


CREATE OR REPLACE VIEW "CoursePerformanceView" AS
SELECT
  course."id" AS "courseId",
  course."demoId",
  course."createdAt",
  course."title" AS "courseTitle",
  course."isPublished",
  course."visibility",
  COALESCE(assignment_stats."departmentCount", 0)::int AS "departmentCount",
  COALESCE(assignment_stats."assignedMemberCount", 0)::int AS "assignedMemberCount",
  COALESCE(content_stats."sectionCount", 0)::int AS "sectionCount",
  COALESCE(content_stats."lessonCount", 0)::int AS "lessonCount",
  COALESCE(content_stats."totalDuration", 0)::int AS "totalDuration",
  COALESCE(content_stats."examCount", 0)::int AS "examCount",
  COALESCE(attempt_stats."membersAttempted", 0)::int AS "membersAttempted",
  COALESCE(attempt_stats."totalAttempts", 0)::int AS "totalAttempts",
  COALESCE(attempt_stats."averageScore", 0::float)::float AS "averageScore",
  CASE
    WHEN COALESCE(attempt_stats."totalAttempts", 0) = 0 THEN 0::float
    ELSE FLOOR(
      (
        attempt_stats."passedAttempts"::float
        / attempt_stats."totalAttempts"::float * 100::float
      ) * 100::float + 0.5::float
    )::float / 100::float
  END AS "passRate",
  COALESCE(certification_stats."certificationsIssued", 0)::int AS "certificationsIssued",
  CASE
    WHEN COALESCE(assignment_stats."assignedMemberCount", 0) = 0 THEN 0::float
    ELSE FLOOR(
      (
        certification_stats."certificationsIssued"::float
        / assignment_stats."assignedMemberCount"::float * 100::float
      ) * 100::float + 0.5::float
    )::float / 100::float
  END AS "certificationRate"
FROM "Course" course
LEFT JOIN LATERAL (
  SELECT
    COUNT(DISTINCT assignment."departmentId")::int AS "departmentCount",
    COUNT(DISTINCT membership."demoMemberId")::int AS "assignedMemberCount"
  FROM "Asset" asset
  INNER JOIN "DepartmentCourse" assignment
    ON assignment."assetId" = asset."id"
  LEFT JOIN "DepartmentMember" membership
    ON membership."departmentId" = assignment."departmentId"
  WHERE asset."courseId" = course."id"
    AND asset."demoId" = course."demoId"
) assignment_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(DISTINCT section."id")::int AS "sectionCount",
    COUNT(lesson."id")::int AS "lessonCount",
    COALESCE(SUM(lesson."duration"), 0)::int AS "totalDuration",
    COUNT(DISTINCT exam."id")::int AS "examCount"
  FROM "Section" section
  LEFT JOIN "Lesson" lesson
    ON lesson."sectionId" = section."id"
  LEFT JOIN "Exam" exam
    ON exam."sectionId" = section."id"
  WHERE section."courseId" = course."id"
) content_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(DISTINCT attempt."demoMemberId")::int AS "membersAttempted",
    COUNT(*)::int AS "totalAttempts",
    COUNT(*) FILTER (
      WHERE attempt."score" >= exam."passingScore"
    )::int AS "passedAttempts",
    COALESCE(
      FLOOR(
        AVG(attempt."score")::float * 100::float + 0.5::float
      )::float / 100::float,
      0::float
    ) AS "averageScore"
  FROM "Section" section
  INNER JOIN "Exam" exam
    ON exam."sectionId" = section."id"
  INNER JOIN "ExamAttempt" attempt
    ON attempt."examId" = exam."id"
  INNER JOIN "DemoMember" dm
    ON dm."id" = attempt."demoMemberId"
  WHERE section."courseId" = course."id"
    AND dm."demoId" = course."demoId"
) attempt_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::int AS "certificationsIssued"
  FROM "Certification" certification
  INNER JOIN "DemoMember" dm
    ON dm."id" = certification."demoMemberId"
  WHERE certification."courseId" = course."id"
    AND dm."demoId" = course."demoId"
) certification_stats ON TRUE;


CREATE OR REPLACE VIEW "DepartmentPerformanceView" AS
SELECT
  department."id" AS "departmentId",
  department."demoId",
  department."createdAt",
  department."name" AS "departmentName",
  BTRIM(CONCAT(manager_user."firstName", ' ', manager_user."lastName")) AS "manager",
  COALESCE(base_stats."memberCount", 0)::int AS "memberCount",
  COALESCE(base_stats."assignedCourseCount", 0)::int AS "assignedCourseCount",
  COALESCE(attempt_stats."membersWithAttempts", 0)::int AS "membersWithAttempts",
  COALESCE(attempt_stats."examAttempts", 0)::int AS "examAttempts",
  COALESCE(attempt_stats."averageExamScore", 0::float)::float AS "averageExamScore",
  CASE
    WHEN COALESCE(attempt_stats."examAttempts", 0) = 0 THEN 0::float
    ELSE FLOOR(
      (
        attempt_stats."passedAttempts"::float
        / attempt_stats."examAttempts"::float * 100::float
      ) * 100::float + 0.5::float
    )::float / 100::float
  END AS "examPassRate",
  COALESCE(certification_stats."certificationsEarned", 0)::int AS "certificationsEarned",
  (
    COALESCE(discussion_stats."questionCount", 0)
    + COALESCE(discussion_stats."answerCount", 0)
  )::int AS "discussionActivity",
  COALESCE(base_stats."messageActivity", 0)::int AS "messageActivity",
  COALESCE(stream_stats."scheduledLiveStreams", 0)::int AS "scheduledLiveStreams",
  COALESCE(stream_stats."completedLiveStreams", 0)::int AS "completedLiveStreams"
FROM "Department" department
INNER JOIN "DemoMember" manager
  ON manager."id" = department."managerId"
INNER JOIN "User" manager_user
  ON manager_user."id" = manager."userId"
LEFT JOIN LATERAL (
  SELECT
    (
      SELECT COUNT(*)::int
      FROM "DepartmentMember" membership
      WHERE membership."departmentId" = department."id"
    ) AS "memberCount",
    (
      SELECT COUNT(DISTINCT asset."courseId")::int
      FROM "DepartmentCourse" assignment
      INNER JOIN "Asset" asset
        ON asset."id" = assignment."assetId"
      WHERE assignment."departmentId" = department."id"
    ) AS "assignedCourseCount",
    (
      SELECT COUNT(*)::int
      FROM "DepartmentMessage" message
      WHERE message."departmentId" = department."id"
        AND NOT message."isDeleted"
    ) AS "messageActivity"
) base_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(DISTINCT attempt."demoMemberId")::int AS "membersWithAttempts",
    COUNT(*)::int AS "examAttempts",
    COUNT(*) FILTER (
      WHERE attempt."score" >= exam."passingScore"
    )::int AS "passedAttempts",
    COALESCE(
      FLOOR(
        AVG(attempt."score")::float * 100::float + 0.5::float
      )::float / 100::float,
      0::float
    ) AS "averageExamScore"
  FROM "DepartmentMember" membership
  INNER JOIN "ExamAttempt" attempt
    ON attempt."demoMemberId" = membership."demoMemberId"
  INNER JOIN "Exam" exam
    ON exam."id" = attempt."examId"
  INNER JOIN "Section" section
    ON section."id" = exam."sectionId"
  WHERE membership."departmentId" = department."id"
    AND EXISTS (
      SELECT 1
      FROM "DepartmentCourse" assignment
      INNER JOIN "Asset" asset
        ON asset."id" = assignment."assetId"
      WHERE assignment."departmentId" = department."id"
        AND asset."courseId" = section."courseId"
    )
) attempt_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::int AS "certificationsEarned"
  FROM "DepartmentMember" membership
  INNER JOIN "Certification" certification
    ON certification."demoMemberId" = membership."demoMemberId"
  WHERE membership."departmentId" = department."id"
    AND EXISTS (
      SELECT 1
      FROM "DepartmentCourse" assignment
      INNER JOIN "Asset" asset
        ON asset."id" = assignment."assetId"
      WHERE assignment."departmentId" = department."id"
        AND asset."courseId" = certification."courseId"
    )
) certification_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    (
      SELECT COUNT(*)::int
      FROM "DepartmentMember" membership
      INNER JOIN "DiscussionQuestion" question
        ON question."demoMemberId" = membership."demoMemberId"
      INNER JOIN "Lesson" lesson
        ON lesson."id" = question."lessonId"
      INNER JOIN "Section" section
        ON section."id" = lesson."sectionId"
      WHERE membership."departmentId" = department."id"
        AND EXISTS (
          SELECT 1
          FROM "DepartmentCourse" assignment
          INNER JOIN "Asset" asset
            ON asset."id" = assignment."assetId"
          WHERE assignment."departmentId" = department."id"
            AND asset."courseId" = section."courseId"
        )
    ) AS "questionCount",
    (
      SELECT COUNT(*)::int
      FROM "DepartmentMember" membership
      INNER JOIN "DiscussionAnswer" answer
        ON answer."demoMemberId" = membership."demoMemberId"
      INNER JOIN "DiscussionQuestion" question
        ON question."id" = answer."discussionId"
      INNER JOIN "Lesson" lesson
        ON lesson."id" = question."lessonId"
      INNER JOIN "Section" section
        ON section."id" = lesson."sectionId"
      WHERE membership."departmentId" = department."id"
        AND EXISTS (
          SELECT 1
          FROM "DepartmentCourse" assignment
          INNER JOIN "Asset" asset
            ON asset."id" = assignment."assetId"
          WHERE assignment."departmentId" = department."id"
            AND asset."courseId" = section."courseId"
        )
    ) AS "answerCount"
) discussion_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (
      WHERE stream."status" = 'SCHEDULED'::"LiveStreamStatus"
    )::int AS "scheduledLiveStreams",
    COUNT(*) FILTER (
      WHERE stream."status" = 'ENDED'::"LiveStreamStatus"
    )::int AS "completedLiveStreams"
  FROM "LiveStream" stream
  WHERE stream."departmentId" = department."id"
) stream_stats ON TRUE;
