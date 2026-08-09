import { FindCursorQuery } from 'src/common/interfaces/find.query';

export interface FindCertificationsCursorQuery extends FindCursorQuery {
  courseId?: string;
  demoMemberId?: string;
}
