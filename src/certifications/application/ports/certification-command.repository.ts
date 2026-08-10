import { Certification } from 'src/certifications/domain/certification';

export interface CourseCompletionSnapshot {
  courseId: string;
  exams: { passedAttemptScore: number | null }[];
}

export abstract class CertificationCommandRepository {
  abstract save(certification: Certification): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Certification | null>;
  abstract existsForCourseAndMember(
    courseId: string,
    demoMemberId: string,
  ): Promise<boolean>;
  abstract courseExists(courseId: string): Promise<boolean>;
  abstract demoMemberExists(demoMemberId: string): Promise<boolean>;
  abstract courseBelongsToMemberDemo(
    courseId: string,
    demoMemberId: string,
  ): Promise<boolean>;
  abstract getCourseCompletionSnapshot(
    examId: string,
    demoMemberId: string,
  ): Promise<CourseCompletionSnapshot | null>;
}
