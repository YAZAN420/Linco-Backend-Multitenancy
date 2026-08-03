import { CreateChoiceInput } from './create-choice-input.interface';

export interface CreateQuestionsBankInput {
  question: string;
  note: string;
  choices: CreateChoiceInput[];
}
