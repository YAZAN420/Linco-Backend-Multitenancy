import { QuestionsBankProps } from './interfaces/questionsBank.props';


export class QuestionsBank {
  constructor(
    public readonly id: string,
    private readonly props: QuestionsBankProps,
  ) {}

  get sectionId(): string {
    return this.props.sectionId;
  }

  get text(): string {
    return this.props.text;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateText(newText: string): void {
    if (this.props.text === newText) return;
    this.props.text = newText;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}