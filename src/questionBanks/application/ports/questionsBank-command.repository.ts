import { QuestionsBank } from '../../domain/questionsBank';

export abstract class QuestionsBankCommandRepository {
  abstract save(questionsBank: QuestionsBank): Promise<void>;
  abstract delete(sectionId: string, id: string): Promise<void>;
  abstract findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBank | null>;
}
