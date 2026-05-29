export enum SortOrder {
  ASC = 'ASC',
  asc = 'asc',
  DESC = 'DESC',
  desc = 'desc',
}
export type OrderByInput = Record<string, SortOrder>;
