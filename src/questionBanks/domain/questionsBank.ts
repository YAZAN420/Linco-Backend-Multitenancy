import { DomainException } from 'src/common/exceptions/domain.exception';
import { QuestionsBankProps } from './interfaces/questionsBank.props';
import { QuestionChoice } from './question-choice';

export class QuestionsBank {
  constructor(
    public readonly id: string,
    private readonly props: QuestionsBankProps,
  ) {}

  get sectionId(): string {
    return this.props.sectionId;
  }

  get choices(): QuestionChoice[] {
    return [...this.props.choices];
  }

  get question(): string {
    return this.props.question;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  addChoice(choice: QuestionChoice): void {
    if (this.props.choices.length >= 50) {
      throw new DomainException('question cannot have more than 50 choice');
    }

    const isChoiceExists = this.props.choices.some(
      (s) => s.choice === choice.choice,
    );
    if (isChoiceExists) {
      throw new DomainException(
        "text must be unique withins question's choices",
      );
    }

    this.props.choices.push(choice);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
