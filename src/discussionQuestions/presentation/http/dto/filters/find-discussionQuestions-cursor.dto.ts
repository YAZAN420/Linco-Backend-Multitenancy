import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDiscussionQuestionsDto } from './filter-discussionQuestions.dto';

export class FindDiscussionQuestionsCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterDiscussionQuestionsDto,
) {}
