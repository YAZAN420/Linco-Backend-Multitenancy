import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from '../interfaces/find-questionsBank.query';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

export abstract class QuestionsBankQueryRepository {
  abstract findAll(
    options: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionsBankWithQuestionChoices>>;
  abstract findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>>;
  abstract findById(id: string): Promise<QuestionsBankWithQuestionChoices | null>;
}
