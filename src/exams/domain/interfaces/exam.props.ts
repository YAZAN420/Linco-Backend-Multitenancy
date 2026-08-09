import { Title } from '../value-objects/title.vo';

export interface ExamProps {
  sectionId: string;
  title: Title;
  numberOfQuestions: number;
  passingScore: number;
  durationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}
