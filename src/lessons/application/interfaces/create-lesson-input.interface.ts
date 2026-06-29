export interface CreateLessonInput {
  title: string;
  order: number;
  videoUrl: string;
  duration: number;
  description: string;
  subTitleUrl?: string;
}
