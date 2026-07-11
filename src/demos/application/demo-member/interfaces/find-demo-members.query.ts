import { DemoMemberFilter } from './demo-member-filter.interface';

export interface FindDemoMembersCursorQuery extends DemoMemberFilter {
  cursor?: string;
  take: number;
}
