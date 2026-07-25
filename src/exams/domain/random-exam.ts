import { Exam } from './exam';
import { RandomExamProps } from './interfaces/random-exam.props';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

export class RandomExam {
  constructor(
    public readonly id: string,
    private readonly props: RandomExamProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get exam(): Exam {
    return this.props.exam;
  }

  get questions(): QuestionsBankWithQuestionChoices[] {
    return this.props.questions;
  }

  addQuestions(question: QuestionsBankWithQuestionChoices): void {
    this.props.questions.push(question);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
