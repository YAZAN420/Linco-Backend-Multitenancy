import { QuestionChoiceResponseDto } from './questionsChoice-response.dto';

export class QuestionsBankResponseDto {
  constructor(
    readonly id: string,
    readonly sectionId: string,
    readonly question: string,
    readonly choices: QuestionChoiceResponseDto[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
