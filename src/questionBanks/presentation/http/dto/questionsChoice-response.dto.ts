export class QuestionChoiceResponseDto {
  constructor(
    readonly text: string,
    readonly isCorrect: boolean,
  ) {}
}
