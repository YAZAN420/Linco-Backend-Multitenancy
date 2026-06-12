export interface LessonProps {
  title: string;
  videoUrl: string;
  order: number;
  sectionId: string;
  courseId: string;
  subTitleUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
