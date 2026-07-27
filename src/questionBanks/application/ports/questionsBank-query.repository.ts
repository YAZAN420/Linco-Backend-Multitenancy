import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindQuestionsBankCursorQuery } from '../interfaces/find-questionsBank.query';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

export abstract class QuestionsBankQueryRepository {
  abstract findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>>;
  abstract getRandomQuestions(
    sectionId: string,
    numberOfQuestions: number,
  ): Promise<QuestionsBankWithQuestionChoices[]>;
  abstract findCorrectChoicesByQuestionIds(
    questionIds: string[],
  ): Promise<{ questionId: string; correctChoiceId: string }[]>;
  abstract findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices | null>;
}
