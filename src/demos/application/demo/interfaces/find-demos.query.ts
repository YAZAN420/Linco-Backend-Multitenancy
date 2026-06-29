import { DemoFilter } from './demo-filter.interface';
import { DemoMemberFilter } from './demo-member-filter.interface';

export interface FindDemosQuery extends DemoFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindDemosCursorQuery extends DemoFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}

export interface FindDepartmentCursorQuery {
  cursor?: string;
  take: number;
}

export interface FindDemoMembersCursorQuery extends DemoMemberFilter {
  cursor?: string;
  take: number;
}
