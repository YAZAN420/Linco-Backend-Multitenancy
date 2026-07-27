import { IsNotEmpty, IsString } from 'class-validator';

export class ExamUserAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsString()
  @IsNotEmpty()
  selectedChoiceId!: string;
}
