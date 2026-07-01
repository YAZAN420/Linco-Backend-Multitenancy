export interface FindCursorQuery {
  cursor?: string;
  take: number;
}

export interface FindQuery {
  page: number;
  take: number;
  orderBy?: any;
}
