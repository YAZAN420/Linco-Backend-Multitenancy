import { QuestionChoice } from '../question-choice';

export interface QuestionsBankProps {
  sectionId: string;
  text: string;
  choices: QuestionChoice[];
  createdAt: Date;
  updatedAt: Date;
}
