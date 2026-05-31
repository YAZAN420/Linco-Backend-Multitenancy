import { UserFilter } from './user-filter.interface';

export interface FindUsersQuery extends UserFilter {
  page: number;
  take: number;
  orderBy?: any;
  with?: string[];
}

export interface FindUsersCursorQuery extends UserFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
  with?: string[];
}
