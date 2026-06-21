import { CreateChoiceInput } from './create-choice-input.interface';

export interface CreateQuestionsBankInput {
  text: string;
  choices: CreateChoiceInput[];
}
