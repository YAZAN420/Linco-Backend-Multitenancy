import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateExamAttemptInput } from 'src/exams/application/interfaces/create-exam-attempt-input.interface';
import { ExamUserAnswerDto } from './exam-user-answer.dto';

export class CreateExamAttemptDto implements CreateExamAttemptInput {
  @IsString()
  @IsNotEmpty()
  examId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamUserAnswerDto)
  answers!: ExamUserAnswerDto[];
}
