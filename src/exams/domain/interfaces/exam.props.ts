import { PositiveInteger } from "src/common/value-objects/positive-integer.vo";
import { Title } from "../value-objects/title.vo";

export interface ExamProps {
  sectionId: string;
  title: Title;
  numberOfQuestions: PositiveInteger;
  durationMinutes: PositiveInteger;
  createdAt: Date;
  updatedAt: Date;
}
