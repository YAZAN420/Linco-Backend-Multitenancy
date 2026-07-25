import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import { Exam } from '../exam';

export interface RandomExamProps {
  exam: Exam;
  questions: QuestionsBankWithQuestionChoices[];
  createdAt: Date;
  updatedAt: Date;
}
