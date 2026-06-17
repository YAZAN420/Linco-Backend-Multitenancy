import { DiscussionQuestionFilter } from './discussionQuestion-filter.interface';

export interface FindDiscussionQuestionsCursorQuery extends DiscussionQuestionFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
