export class QuestionChoiceResponseDto {
  constructor(
    readonly choice: string,
    readonly isCorrect: boolean,
  ) {}
}
