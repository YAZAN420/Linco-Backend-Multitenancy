import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { Exam } from '../exam';

export interface RandomExamProps {
  exam: Exam;
  questions: QuestionsBank[];
  createdAt: Date;
  updatedAt: Date;
}
