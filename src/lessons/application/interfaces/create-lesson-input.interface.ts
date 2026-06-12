export interface CreateLessonInput {
  title: string;
  order: number;
  videoUrl: string;
  subTitleUrl: string | null;
  sectionId: string;
  courseId: string;
}
