import { QuestionsBankResponseDto } from "src/questionBanks/presentation/http/dto/questionsBank-response.dto";

export class RandomExamResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly numberOfQuestions: number,
    readonly durationMinutes: number,
    readonly questions: QuestionsBankResponseDto[],
    readonly sectionId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
