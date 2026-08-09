import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CreateExamInput } from 'src/exams/application/interfaces/create-exam-input.interface';

export class CreateExamDto implements CreateExamInput {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsPositive()
  durationMinutes!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  numberOfQuestions!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  passingScore!: number;
}
