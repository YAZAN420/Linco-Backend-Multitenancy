import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from '../interfaces/find-questionsBank.query';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';

export abstract class QuestionsBankQueryRepository {
  abstract findAll(
    options: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionsBank>>;
  abstract findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBank>>;
  abstract findById(id: string): Promise<QuestionsBank | null>;
  abstract getRandomQuestions(
    sectionId: string,
    numberOfQuestions: number,
  ): Promise<QuestionsBank[]>;
}
