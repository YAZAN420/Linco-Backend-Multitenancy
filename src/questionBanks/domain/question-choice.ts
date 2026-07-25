import { QuestionChoiceProps } from './interfaces/question-choice.props';

export class QuestionChoice {
  constructor(
    public readonly id: string,
    private readonly props: QuestionChoiceProps,
  ) {}

  get questionId(): string {
    return this.props.questionId;
  }

  get choice(): string {
    return this.props.choice;
  }

  get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
