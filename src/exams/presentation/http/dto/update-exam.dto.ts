import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { UpdateExamInput } from 'src/exams/application/interfaces/update-exam-input.interface';

export class UpdateExamDto implements UpdateExamInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  durationMinutes!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  @IsInt()
  numberOfQuestions!: number;
}
