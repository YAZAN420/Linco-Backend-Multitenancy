import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ExamUserAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  selectedChoiceIds!: string[];
}
