import { LessonFilter } from './lesson-filter.interface';

export interface FindLessonsCursorQuery extends LessonFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
