import { ExamAttemptProps } from './interfaces/exam-attempt.props';
import { PositiveInteger } from 'src/common/value-objects/positive-integer.vo';

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
    return this.props.score.value;
  }


  updateScore(newScore: PositiveInteger): void {
    if (this.props.score.equals(newScore)) return;
    this.props.score = newScore;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
