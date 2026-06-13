export interface CreateLessonInput {
  title: string;
  order: number;
  videoUrl: string;
  subTitleUrl?: string;
  courseId: string;
}
