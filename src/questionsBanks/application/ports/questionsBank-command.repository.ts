import { QuestionsBank } from 'src/questionsBanks/domain/questionsBank';

export abstract class QuestionsBankCommandRepository {
  abstract save(questionsBank: QuestionsBank): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<QuestionsBank | null>;
}
