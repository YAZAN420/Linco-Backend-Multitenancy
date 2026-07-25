import { QuestionChoice } from '../question-choice';

export interface QuestionsBankProps {
  sectionId: string;
  question: string;
  choices: QuestionChoice[];
  createdAt: Date;
  updatedAt: Date;
}
