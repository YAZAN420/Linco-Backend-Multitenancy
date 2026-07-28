import { DepartmentMessageFilter } from './departmentMessage-filter.interface';

export interface FindDepartmentMessagesCursorQuery extends DepartmentMessageFilter {
  cursor?: string;
  take: number;
}
