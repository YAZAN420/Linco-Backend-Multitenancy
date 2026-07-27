import { Title } from './value-objects/title.vo';
import { ExamProps } from './interfaces/exam.props';

export class Exam {
  constructor(
    public readonly id: string,
    private readonly props: ExamProps,
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
    return this.props.numberOfQuestions;
  }

  get durationMinutes(): number {
    return this.props.durationMinutes;
  }

  get sectionId(): string {
    return this.props.sectionId;
  }

  updateTitle(newTitle: Title): void {
    if (this.props.title.equals(newTitle)) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateDurationMinutes(newDurationMinutes: number): void {
    if (this.props.durationMinutes === newDurationMinutes) return;
    this.props.durationMinutes = newDurationMinutes;
    this.touch();
  }

  updateNumberOfQuestions(newNumberOfQuestions: number): void {
    if (this.props.numberOfQuestions === newNumberOfQuestions) return;
    this.props.numberOfQuestions = newNumberOfQuestions;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
