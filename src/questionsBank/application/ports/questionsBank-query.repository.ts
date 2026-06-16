import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from '../interfaces/find-questionsBank.query';
import { QuestionBank } from 'src/generated/prisma/client';

export abstract class QuestionsBankQueryRepository {
  abstract findAll(options: FindQuestionsBankQuery): Promise<PageDto<QuestionBank>>;
  abstract findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionBank>>;
  abstract findById(id: string): Promise<QuestionBank | null>;
}
