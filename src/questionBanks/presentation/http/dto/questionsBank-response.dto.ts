import { QuestionChoiceResponseDto } from './questionsChoice-response.dto';

export class QuestionsBankResponseDto {
  constructor(
    readonly id: string,
    readonly sectionId: string,
    readonly choices: QuestionChoiceResponseDto[],
    readonly text: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
