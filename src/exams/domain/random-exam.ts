import { Exam } from './exam';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { RandomExamProps } from './interfaces/random-exam.props';

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

  get questions(): QuestionsBank[] {
    return this.props.questions;
  }

  addQuestions(question: QuestionsBank): void {
    this.props.questions.push(question);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
