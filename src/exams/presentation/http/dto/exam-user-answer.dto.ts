import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ExamUserAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsArray()
  @IsString({ each: true })
  selectedChoiceIds!: string[];
}
