export interface QuestionsBankProps {
  createdAt: Date;
  updatedAt: Date;
}

export class QuestionsBank {
  constructor(
    public readonly id: string,
    private readonly props: QuestionsBankProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
