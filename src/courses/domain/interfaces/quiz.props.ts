import { PositiveInteger } from "../value-objects/positive-integer.vo";
import { Title } from "../value-objects/title.vo";

export interface QuizProps {
  sectionId: string;
  title: Title;
  numberOfQuestions: PositiveInteger;
  durationMinutes: PositiveInteger;
  createdAt: Date;
  updatedAt: Date;
}
