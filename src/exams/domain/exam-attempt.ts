import { ExamAttemptProps } from './interfaces/exam-attempt.props';

export class ExamAttempt {
  constructor(
    public readonly id: string,
    private readonly props: ExamAttemptProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get userId(): string {
    return this.props.userId;
  }

  get examId(): string {
    return this.props.examId;
  }

  get score(): number {
    return this.props.score;
  }

  updateScore(newScore: number): void {
    if (this.props.score === newScore) return;
    this.props.score = newScore;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
