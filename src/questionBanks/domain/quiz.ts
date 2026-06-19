import { QuizProps } from './interfaces/quiz.props';
import { PositiveInteger } from './value-objects/positive-integer.vo';
import { Title } from './value-objects/title.vo';

export class Quiz {
  constructor(
    public readonly id: string,
    private readonly props: QuizProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get title(): string {
    return this.props.title.value;
  }

  get numberOfQuestions(): number {
    return this.props.numberOfQuestions.value;
  }

  get durationMinutes(): number {
    return this.props.durationMinutes.value;
  }

  get sectionId(): string {
    return this.props.sectionId;
  }

  updateTitle(newTitle: Title): void {
    if (this.props.title.equals(newTitle)) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateDurationMinutes(newDurationMinutes: PositiveInteger): void {
    if (this.props.durationMinutes.equals(newDurationMinutes)) return;
    this.props.durationMinutes = newDurationMinutes;
    this.touch();
  }

  updateNumberOfQuestions(newNumberOfQuestions: PositiveInteger): void {
    if (this.props.numberOfQuestions.equals(newNumberOfQuestions)) return;
    this.props.numberOfQuestions = newNumberOfQuestions;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
